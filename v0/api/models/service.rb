class V0
  module Api
    module Models
      class Service

        def initialize(system, name)
          @system = system
          @name = name
        end

        attr_accessor :name

        def service_api
          @service_api ||= @system.engines_api.service(@name)
        end

        def container
          @container ||= service_api.container
        end

        def publisher_namespace
          @publisher_namespace ||= container[:publisher_namespace]
        end

        def type_path
          @type_path ||= container[:type_path]
        end

        def service_definition
          @service_definition ||= @system.service_definition_for( publisher_namespace, type_path )
        end

        ######################################################################
        # Instructions
        ######################################################################

        def instruct(instruction)
          Thread.new do
            service_api.instruct_container(instruction)
          end
          { message: "OK" }
        end

        ######################################################################
        # Websites
        ######################################################################

        def websites
          service_api.websites
        end

        ######################################################################
        # About
        ######################################################################

        def about
          service_definition
        end

        ######################################################################
        # Processes
        ######################################################################

        def processes
          service_api.processes
        end

        ######################################################################
        # Logs
        ######################################################################

        def logs
          service_api.logs
        end

        ######################################################################
        # Memory
        ######################################################################

        def memory
          { memory: service_api.memory_metrics[:limit].to_i/1024/1024 }
        end

        def update_memory( form_params )
          return { message: "OK" } \
            if service_api.update_memory( form_params )
          raise NonFatalError.new "Failed to update memory.", 405
        end

        ######################################################################
        # Environment variables
        ######################################################################

        def environment_variables
          container[:environments]
        end

        ########################################################################
        # Services
        ########################################################################

        def services_report
          {
            persistent: service_api.persistent_services,
            non_persistent: service_api.non_persistent_services,
            available: service_api.available_services
          }
        end

        def services
          {
            persistent: service_api.persistent_services.map do |service|
              service_summary_for(service)
            end.sort_by{ |service| service[:label] },
            non_persistent: service_api.non_persistent_services.map do |service|
              service_summary_for(service)
            end.sort_by{ |service| service[:label] }
          }
        end

        def service_summary_for( service )
          service_definition = @system.service_definition_for( service[:publisher_namespace], service[:type_path] )
          {
            label: "#{service_definition[:title]} #{service[:service_container_name]}:#{service[:service_handle]}",
            description: service_definition[:description],
            publisher_namespace: service[:publisher_namespace],
            type_path: service[:type_path],
            service_handle: service[:service_handle],
            origin: service[:shared] ? "shared" : service[:freed_orphan] ? "adopted" : "created",
          }
        end

        def service_detail_for( publisher_namespace, type_path, service_handle )
          service_definition = @system.service_definition_for( publisher_namespace, type_path )
          persistent_services = service_api.persistent_services_for( publisher_namespace: publisher_namespace, type_path: type_path )
          service = persistent_services.find do |service|
            service[:service_handle] == service_handle
          end
          {
            label: "#{service_definition[:title]} #{service[:service_container_name]}:#{service_handle}",
            description: service_definition[:description],
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            params: service_definition[:consumer_params].keys.map do |name|
              param = service_definition[:consumer_params][name]
              param[:value] = service[:variables][name]
              if param[:input]
                param
              else
                Helpers.legacy_input_definition_for param
              end
            end,
          }
        end

        def available_services
          service_api.available_services.map do |type, services|
            {
              type => services.map do |service|
                {
                  publisher_namespace: service[:publisher_namespace],
                  type_path: service[:type_path],
                  label: "#{service[:title]} (#{service[:service_container]})",
                  description: service[:description],
                }
              end
            }
          end.inject :merge
        end

        def register_nonpersistent_service( publisher_namespace, type_path, service_handle )
          service_api.register_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def deregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
          service_api.deregister_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def reregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
          service_api.reregister_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def consumers
          service_api.consumers
        end

        ######################################################################
        # Actions
        ######################################################################

        def actions
          ( service_definition[:service_actionators] || {} ).values
        end

        def action(action_name)
          ( service_definition[:service_actionators] || {} )[action_name.to_sym].tap do |action|
            action[:variables] = action[:variables].map do |variable|
              variable[:value] = resolve_string variable[:value]
              variable
            end
            if action[:return_type] == 'file'
              action[:return_file_name] = resolve_string action[:return_file_name]
            end
          end
        end

        def perform_action( actionator_name, variables )
          service_api.perform_action(
            actionator_name: actionator_name,
            variables: variables
          )
        end

        ######################################################################
        # Configurations
        ######################################################################

        def configurations
          ( service_definition[:configurators] || {} ).values.map do |configurator|
            {
              name: configurator[:name],
              label: configurator[:label] || configurator[:name],
              no_save: configurator[:no_save],
              description: configurator[:description],
            }
          end
        end

        def configuration(configurator_name)
          configurator = configurator_for(configurator_name)
          if configurator[:no_save]
            variables = []
          else
            current_config = configuration_for(configurator_name)[:variables]
            variables = configurator[:variables].map do |param|
              {
                label: param.dig(:input, :label) || param[:name],
                value: current_config[ param[:name].to_sym ]
              }
            end
          end
          {
            name: configurator[:name],
            label: configurator[:label] || configurator[:name],
            no_save: configurator[:no_save],
            description: configurator[:description],
            variables: variables
          }
        end

        def configuration_edit(configurator_name)
          configurator = configurator_for(configurator_name)
          if configurator[:no_save]
            configurator[:variables] = configurator[:variables].map do |variable|
              variable[:value] = resolve_string( variable[:value] )
              variable
            end
          else
            current_config = configuration_for(configurator_name)[:variables]
            configurator[:variables] = configurator[:variables].map do |variable|
              current_value = current_config[ variable[:name].to_sym ]
              variable[:value] =
                current_value ? current_value : resolve_string( variable[:value] )
              variable
            end
          end
          configurator
        end

        def configurator_for(configurator_name)
          service_definition[:configurators][configurator_name.to_sym]
        end

        def configuration_for(configurator_name)
          service_api.configuration(
            configurator_name: configurator_name )
        end

        def perform_configuration( configurator_name, variables )
          service_api.perform_configuration(
            configurator_name: configurator_name,
            variables: variables )
        end

        ######################################################################
        # Data export/import
        ######################################################################

        def export
          service_api.export
        end

        def import(file)
          service_api.import file
        end

        ######################################################################
        # Resolve string
        ######################################################################

        def resolve_string(string)
          return "" if string.to_s == ""
          service_api.resolve_string(string.to_s)
        end

      end
    end
  end
end
