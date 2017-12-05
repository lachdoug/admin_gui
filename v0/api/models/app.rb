class V0
  module Api
    module Models
      class App

        def initialize(system, name)
          @system = system
          @name = name
        end

        attr_accessor :name

        def app_api
          @app_api ||= @system.engines_api.app(@name)
        end

        def container
          @container ||= app_api.container
        end

        def blueprint
          @blueprint ||= app_api.blueprint
        end

        ######################################################################
        # Icon
        ######################################################################

        def icon_url
          { icon_url: app_api.icon_url }
          # "https://library.engines.org/system/apps/icons/000/000/006/small/PhpMyAdmin_logo.png?1486242338"
        end

        def update_icon_url( data )
          app_api.update_icon_url( data )
        end

        ######################################################################
        # Installation
        ######################################################################

        def uninstall(opts)
          return { message: "OK" } if app_api.uninstall
          raise NonFatalError.new "Failed to uninstall #{name}.", 405
        end

        def build_report
          { build_report: app_api.build_report }
        end

        ######################################################################
        # Instructions
        ######################################################################

        def instruct(instruction)
          # Thread.new do
          #   app_api.instruct_container(instruction)
          # end
          # { message: "OK" }
          return { message: "OK" } if app_api.instruct_container(instruction)
          raise NonFatalError.new "Failed to instruct #{name} to #{instruction}.", 405
        end

        ######################################################################
        # Properties
        ######################################################################

        def websites
          app_api.websites
        end

        ######################################################################
        # About
        ######################################################################

        def about
          blueprint[:metadata] || {}
        end

        # def icon
        #   { icon_url: icon_url }
        # end

        def processes
          app_api.processes
        end

        def logs
          app_api.logs
        end

        ######################################################################
        # Network
        ######################################################################

        def network
          {
            http_protocol: container[:protocol],
            host_name: container[:hostname],
            domain_name: container[:domain_name],
            available_domain_names: @system.domains[:names].map{ |domain| domain[:domain_name] },
            default_http_protocol: blueprint[:software][:base][:http_protocol],
            reserved_fqdns: @system.reserved_fqdns
          }
        end

        def update_network( data )
          app_api.update_network( data )
        end

        ######################################################################
        # Memory
        ######################################################################

        def memory
          { memory: app_api.memory_metrics[:limit].to_i/1024/1024 }
        end

        def update_memory( data )
          return { message: "OK" } \
            if app_api.update_memory( data )
          raise NonFatalError.new "Failed to update memory.", 405
        end

        ######################################################################
        # Environment variables
        ######################################################################

        def environment
          {}.tap do |result|
            container[:environments].map do |variable|
              if [ "Memory", "LANGUAGE", "LANG", "LC_ALL" ].include? variable[:name]
                variable[:owner_type] = "system"
                variable
              else
                variable
              end
            end.group_by do |variable|
              variable[:owner_type]
            end.tap do |envs|
              result[:application] = application_environment_variables_for envs["application"] || []
              result[:user] = envs["user"] || []
              result[:system] = envs["system"] || []
              result[:service_consumers] = service_consumer_environment_variables_for envs["service_consumer"] || []
            end
          end

        end

        def application_environment_variables_for(application_envs)
          {
            variables: application_envs || [],
            blueprint_environment_variables: blueprint[:software][:environment_variables]
          }
        end

        def service_consumer_environment_variables_for(service_consumer_envs)
          return {} unless service_consumer_envs
          service_consumer_envs.group_by do |env|
            env[:owner_path].split(':').first
          end.map do |owner_group, envs|
            publisher_namespace, *type_path = owner_group.split('/')
            type_path = type_path.join('/')
            service_definition = @system.service_definition_for( publisher_namespace, type_path )
            {
              owner_group => { variables: envs, consumer_params: service_definition[:consumer_params].values, label: service_definition[:title] }
            }
          end.inject :merge
        end

        def update_environment_variables( data )
          app_api.update_environment_variables( variables: data )
        end

        ########################################################################
        # Services
        ########################################################################

        def services_report
          {
            persistent: app_api.persistent_services,
            non_persistent: app_api.non_persistent_services,
            available: app_api.available_services
          }
        end


        def services
          {
            persistent: app_api.persistent_services.map do |service|
              service_summary_for(service)
            end.sort_by{ |service| service[:label] },
            non_persistent: app_api.non_persistent_services.map do |service|
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
        #     persistent: app_api.persistent_services.map do |service|
        #       service_detail_for(service[:publisher_namespace], service[:type_path], service[:service_handle] )
        #     end.sort_by{ |service| service[:label] },
        #     non_persistent: app_api.non_persistent_services.map do |service|
        #       service_detail_for(service[:publisher_namespace], service[:type_path], service[:service_handle] )
        #     end.sort_by{ |service| service[:label] }
        #   }
        # end

        def service_detail_for( publisher_namespace, type_path, service_handle )
          service_definition = @system.service_definition_for( publisher_namespace, type_path )
          persistent_services = app_api.persistent_services_for( publisher_namespace: publisher_namespace, type_path: type_path )
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

        def update_persistent_service( publisher_namespace, type_path, service_handle, data )
          app_api.update_persistent_service( {
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            variables: data[:variables]
          } )
        end

        def export_persistent_service( publisher_namespace, type_path, service_handle )
          app_api.export_persistent_service( {
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
          } )
        end

        def import_persistent_service( publisher_namespace, type_path, service_handle, file )
          app_api.import_persistent_service( {
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            file: file
          } )
        end

        def available_services
          app_api.available_services.map do |type, services|
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

        def available_persistent_services_for( publisher_namespace, type_path )
          service_definition = @system.service_definition_for( publisher_namespace, type_path )
          # byebug
          params = service_definition[:consumer_params].values.select do |param|
            param[:ask_at_build_time] == true || param[:immutable] != true
          end.map do |param|
            if param[:input]
              param
            else
              Helpers.legacy_input_definition_for param
            end
          end
          {
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            label: service_definition[:title],
            description: service_definition[:description],
            shareable: @system.shareable_service_consumers_for( publisher_namespace, type_path ),
            adoptable: @system.adoptable_service_consumers_for( publisher_namespace, type_path ),
            params: params,
          }
        end

        def create_new_persistent_service( publisher_namespace, type_path, data )
          app_api.create_new_persistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            variables: data[:variables] )
        end

        def delete_persistent_service( publisher_namespace, type_path, service_handle, data )
          app_api.delete_existing_persistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            delete_data: data && data[:delete_data] == 'true' )
        end

        def share_existing_persistent_service( publisher_namespace, type_path, service_handle, parent, data )
          app_api.share_existing_persistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            parent: parent,
            variables: data[:variables] )
        end

        def adopt_orphan_persistent_service( publisher_namespace, type_path, service_handle, parent, data )
          app_api.adopt_orphan_persistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            parent: parent,
            variables: data[:variables] )
        end

        def new_nonpersistent_service( publisher_namespace, type_path )
          service_definition = @system.service_definition_for( publisher_namespace, type_path )
          params = service_definition[:consumer_params].values.select do |param|
            param[:ask_at_build_time] == true || param[:immutable] != true
          end.map do |param|
            if param[:input]
              param
            else
              Helpers.legacy_input_definition_for param
            end
          end.map do |param|
            param[:value] = resolve_string( param[:value] )
            param
          end
          {
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            label: service_definition[:title],
            description: service_definition[:description],
            params: params,
          }
        end

        def create_nonpersistent_service( publisher_namespace, type_path, data )
          app_api.create_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            variables: data[:variables] )
        end

        def register_nonpersistent_service( publisher_namespace, type_path, service_handle )
          app_api.register_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def deregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
          app_api.deregister_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def reregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
          app_api.reregister_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def reregister_nonpersistent_service( publisher_namespace, type_path, service_handle )
          app_api.reregister_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end

        def update_nonpersistent_service( publisher_namespace, type_path, service_handle, data )
          app_api.update_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle,
            variables: data[:variables] )
        end

        def delete_nonpersistent_service( publisher_namespace, type_path, service_handle )
          app_api.delete_nonpersistent_service(
            publisher_namespace: publisher_namespace,
            type_path: type_path,
            service_handle: service_handle )
        end


        ######################################################################
        # Actions
        ######################################################################

        def actions
          blueprint.dig( :software, :actionators ) || []
        end

        def action(action_name)
          actions.find{ |action| action[:name] == action_name }.tap do |action|
            action[:variables] = ( action[:variables] || [] ).map do |variable|
              variable[:value] = resolve_string variable[:value]
              variable
            end
            if action[:return_type] == 'file'
              action[:return_file_name] = resolve_string variable[:return_file_name]
            end
          end
        end


        def perform_action( actionator_name, variables )
          app_api.perform_action(
            actionator_name: actionator_name,
            variables: variables
          )
        end

        ######################################################################
        # Resolve strings
        ######################################################################

        def resolve_strings(strings)
          strings.map do |string|
            resolve_string(string)
          end
        end

        def resolve_string(string)
          app_api.resolve_string(string.to_s)
        end


        ######################################################################
        # OOM
        ######################################################################

        def clear_had_oom
          app_api.clear_had_oom
        end

      end
    end
  end
end
