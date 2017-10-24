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

        # def blueprint
        #   @blueprint ||= service_api.blueprint
        # end
        #
        # ######################################################################
        # # Installation
        # ######################################################################
        #
        # def uninstall(opts)
        #   return { message: "OK" } if service_api.uninstall
        #   raise NonFatalError.new "Failed to uninstall #{name}.", 405
        # end
        #
        # def build_report
        #   { build_report: service_api.build_report }
        # end
        #
        ######################################################################
        # Instructions
        ######################################################################

        def instruct(instruction)
          # byebug
          return { message: "OK" } if service_api.instruct_container(instruction)
          raise NonFatalError.new "Failed to instruct #{name} to #{instruction}.", 405
        end
        #
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
        #
        # ######################################################################
        # # Network
        # ######################################################################
        #
        # def network
        #   # byebug
        #   {
        #     http_protocol: container[:protocol],
        #     host_name: container[:hostname],
        #     domain_name: container[:domain_name],
        #     available_domain_names: @system.domains[:names].map{ |domain| domain[:domain_name] },
        #     default_http_protocol: blueprint[:software][:base][:http_protocol],
        #     reserved_fqdns: @system.reserved_fqdns
        #   }
        # end
        #
        # def update_network( form_params )
        #   service_api.update_network( form_params )
        # end

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
          # {}.tap do |result|
          #   container[:environments].map do |variable|
          #     if [ "Memory", "LANGUAGE", "LANG", "LC_ALL" ].include? variable[:name]
          #       variable[:owner_type] = "system"
          #       variable
          #     else
          #       variable
          #     end
          #   end.group_by do |variable|
          #     variable[:owner_type]
          #   end.tap do |envs|
          #     result[:servicelication] = servicelication_environment_variables_for envs["servicelication"] || []
          #     result[:user] = envs["user"] || []
          #     result[:system] = envs["system"] || []
          #     result[:service_consumers] = service_consumer_environment_variables_for envs["service_consumer"] || []
          #   end
          # end

        end

        # def servicelication_environment_variables_for(servicelication_envs)
        #   {
        #     variables: servicelication_envs || [],
        #     blueprint_environment_variables: blueprint[:software][:environment_variables]
        #   }
        # end
        #
        # def service_consumer_environment_variables_for(service_consumer_envs)
        #   return {} unless service_consumer_envs
        #   service_consumer_envs.group_by do |env|
        #     env[:owner_path].split(':').first
        #   end.map do |owner_group, envs|
        #     publisher_namespace, *type_path = owner_group.split('/')
        #     type_path = type_path.join('/')
        #     service_definition = @system.service_definition_for( publisher_namespace, type_path )
        #     {
        #       owner_group => { variables: envs, consumer_params: service_definition[:consumer_params].values, label: service_definition[:title] }
        #     }
        #   end.inject :merge
        # end
        #
        # def update_environment_variables( data )
        #   byebug
        #   service_api.update_environment_variables( variables: data )
        # end
        #
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


        # def services_detail
        #   {
        #     persistent: service_api.persistent_services.map do |service|
        #       # service
        #       service_detail_for(service[:publisher_namespace], service[:type_path], service[:service_handle] )
        #     end.sort_by{ |service| service[:label] },
        #     non_persistent: service_api.non_persistent_services.map do |service|
        #       # service
        #       service_detail_for(service[:publisher_namespace], service[:type_path], service[:service_handle] )
        #     end.sort_by{ |service| service[:label] }
        #   }
        # end



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
                Lib.legacy_input_definition_for param
              end
            end,
          }
        end
        #
        # def update_persistent_service( publisher_namespace, type_path, service_handle, form_params )
        #   service_api.update_persistent_service( {
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle,
        #     variables: form_params[:variables]
        #   } )
        # end
        #
        # def export_persistent_service( publisher_namespace, type_path, service_handle )
        #   service_api.export_persistent_service( {
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle,
        #   } )
        # end
        #
        # def import_persistent_service( publisher_namespace, type_path, service_handle, file )
        #   service_api.import_persistent_service( {
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle,
        #     file: file
        #   } )
        # end
        #
        def available_services
          # service_api.available_services
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
        #
        # def available_persistent_services_for( publisher_namespace, type_path )
        #   service_definition = @system.service_definition_for( publisher_namespace, type_path )
        #   params = service_definition[:consumer_params].values.select do |param|
        #     param[:ask_at_build_time] == true || param[:immutable] != true
        #   end.map do |param|
        #     if param[:input]
        #       param
        #     else
        #       Lib.legacy_input_definition_for param
        #     end
        #   end
        #   {
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     label: service_definition[:title],
        #     description: service_definition[:description],
        #     shareable: @system.shareable_service_consumers_for( publisher_namespace, type_path ),
        #     adoptable: @system.adoptable_service_consumers_for( publisher_namespace, type_path ),
        #     params: params,
        #   }
        # end
        #
        # def create_new_persistent_service( publisher_namespace, type_path, data )
        #   service_api.create_new_persistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     variables: data[:variables] )
        # end
        #
        # def delete_persistent_service( publisher_namespace, type_path, service_handle )
        #   service_api.share_existing_persistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle )
        # end
        #
        # def share_existing_persistent_service( publisher_namespace, type_path, service_handle, data )
        #   service_api.share_existing_persistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle,
        #     variables: data[:variables] )
        # end
        #
        # def adopt_orphan_persistent_service( publisher_namespace, type_path, service_handle, data )
        #   service_api.adopt_orphan_persistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle,
        #     variables: data[:variables] )
        # end
        #
        # def register_nonpersistent_service( publisher_namespace, type_path, service_handle )
        #   service_api.register_nonpersistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle )
        # end
        #
        # def deregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
        #   service_api.deregister_nonpersistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle )
        # end
        #
        # def reregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
        #   service_api.reregister_nonpersistent_service(
        #     publisher_namespace: publisher_namespace,
        #     type_path: type_path,
        #     service_handle: service_handle )
        # end

        ######################################################################
        # Actions
        ######################################################################

        def actions
          ( service_definition[:service_actionators] || {} ).values.map do |actionator|
            format_actionator_for(actionator)
          end
        end

        def format_actionator_for(actionator)
          actionator[:params] = ( actionator[:params] || [] ).map do |name, param|
            if param[:input]
              param
            else
              Lib.legacy_input_definition_for param
            end
          end
          actionator
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
            configuration_detail_for(configurator)
          end
        end

        def configuration_detail_for(configurator)
          configuration_for(configurator[:name])
          byebug
          configurator[:params] = ( configurator[:params] || [] ).map do |name, param|
            if param[:input]
              param
            else
              Lib.legacy_input_definition_for param
            end
          end
          configurator
        end

        def perform_configuration( configurator_name, variables )
          service_api.perform_configuration(
            configurator_name: configurator_name,
            variables: variables
          )
        end

        def configuration_for(configurator_name)
          service_api.configuration(
            configurator_name: configurator_name
          )
        end


        # ######################################################################
        # # Resolve strings
        # ######################################################################
        #
        # def resolve_strings(strings)
        #   strings.map do |string|
        #     # byebug if string == "_Engines_System(random(10))"
        #     service_api.resolve_string(string)
        #   end
        # end
        #
        #
        # ######################################################################
        # # OOM
        # ######################################################################
        #
        # def clear_had_oom
        #   service_api.clear_had_oom
        # end

      end
    end
  end
end