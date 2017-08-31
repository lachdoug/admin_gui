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
        # Installation
        ######################################################################

        def uninstall(opts)
          return { message: "OK" } if app_api.uninstall == 'true'
          raise NonFatalError.new "Failed to uninstall #{name}.", 405
        end

        def build_report
          { build_report: app_api.build_report }
        end

        ######################################################################
        # Instructions
        ######################################################################

        def instruct(instruction)
          return { message: "OK" } if app_api.instruct_container(instruction) == 'true'
          raise NonFatalError.new "Failed to instruct #{name} to #{instruction}.", 405
        end

        ######################################################################
        # Properties
        ######################################################################

        def websites
          app_api.websites
        end

        def about
          app_api.blueprint.dig(:metadata)
        end

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
          # byebug
          {
            http_protocol: container[:protocol],
            host_name: container[:hostname],
            domain_name: container[:domain_name],
            available_domain_names: @system.domains[:names].map{ |domain| domain[:domain_name] },
            default_http_protocol: blueprint[:software][:base][:http_protocol],
            reserved_fqdns: @system.reserved_fqdns
          }
        end

        def update_network( form_params )
          app_api.update_network( form_params )
        end

        ######################################################################
        # Memory
        ######################################################################

        def memory
          { memory: app_api.memory_metrics[:limit].to_i/1024/1024 }
        end

        def update_memory( form_params )
          return { message: "OK" } \
            if app_api.update_memory( form_params ) == 'true'
          raise NonFatalError.new "Failed to update memory.", 405
        end

        ######################################################################
        # Environment
        ######################################################################

        def environment
          {}.tap do |result|
            container[:environments].group_by do |variable|
              variable[:owner_type]
            end.tap do |envs|
              result[:application] = application_environment_variables_for envs["application"]
              result[:service_consumers] = service_consumer_environment_variables_for envs["service_consumer"]
            end
          end

        end

        def application_environment_variables_for(application_envs)
          {
            variables: application_envs || [],
            software_environment_variables: blueprint[:software][:environment_variables]
          }
        end

        def service_consumer_environment_variables_for(service_consumer_envs)
          return {} unless service_consumer_envs
          service_consumer_envs.group_by do |env|
            env[:owner_path].split(':').first
          end.map do |owner_group, envs|
            service_definition = @system.service_definition_for( owner_group )
            {
              owner_group => { variables: envs, params: service_definition[:consumer_params], label: service_definition[:title] }
            }
          end.inject :merge
        end

        ########################################################################
        # Services
        ########################################################################

        # <%= report_collapse_data 'Available services', @app.app_api.available_services %>
        # <%= report_collapse_data 'Non-persistent services', @app.app_api.non_persistent_services %>
        # <%= report_collapse_data 'Persistent services', @app.app_api.persistent_services %>

        # services

        def services
          {
            persistent: app_api.persistent_services.sort_by{ |service| service[:container_name] }.map do |service|
              service_detail_for(service)
            end,
            non_persistent: app_api.non_persistent_services.sort_by{ |service| service[:container_name] }.map do |service|
              service_detail_for(service)
            end
          }
        end

        def service_detail_for(service)
          definition_path = service[:publisher_namespace] + "/" + service[:type_path]
          service_definition = @system.service_definition_for( definition_path )
          service_handle = service[:service_handle]
          {
            label: "#{service_definition[:title]} (#{service_handle})",
            description: service_definition[:description],
            definition_path: definition_path,
            service_handle: service_handle,
            # consumer: service,
            params: service_definition[:consumer_params].keys.map do |name|
              param = service_definition[:consumer_params][name]
              param[:value] = service[:variables][name]
              if param[:input]
                param
              else
                Lib.update_legacy_input_definition_for param
              end
            end,
          }
        end


        def available_services
          app_api.available_services.map do |type, services|
            {
              type => services.map do |service|
                {
                  label: "#{service[:title]} (#{service[:service_container]})",
                  definition_id: "#{service[:publisher_namespace]}/#{service[:type_path]}".gsub( "/", "|" )
                }
              end
            }
          end.inject :merge
        end

        def available_persistent_service_for( definition_id )
          definition_path = definition_id.gsub( "|", "/" )
          service_definition = @system.service_definition_for( definition_path )
          {
            label: service_definition[:title],
            description: service_definition[:description],
            definition_id: definition_id,
            shareable: @system.shareable_service_consumers_for( definition_path ),
            adoptable: @system.adoptable_service_consumers_for( definition_path ),
            params: service_definition[:consumer_params].keys.map do |name|
              param = service_definition[:consumer_params][name]
              if param[:input]
                param
              else
                Lib.update_legacy_input_definition_for param
              end
            end,
          }
        end


      end
    end
  end
end
