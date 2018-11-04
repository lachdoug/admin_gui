class V0
  module Api
    module Services
      class EnginesApi
        class Service

          def initialize(system_api, name)
            @system_api = system_api
            @name = name
          end

          def container
             @system_api.get "containers/service/#{@name}"
          end

          ######################################################################
          # Instructions
          ######################################################################

          def instruct_container(instruction)

            if instruction == "destroy"
              @system_api.delete "containers/service/#{@name}/#{instruction}"
            else
              @system_api.get "containers/service/#{@name}/#{instruction}"
            end
          end

          ######################################################################
          # Websites
          ######################################################################

          def websites
            @system_api.get "containers/service/#{@name}/websites"
          end

          ######################################################################
          # Processes
          ######################################################################

          def processes
            @system_api.get "containers/service/#{@name}/ps"
          end

          ######################################################################
          # Logs
          ######################################################################

          def logs
            @system_api.get "containers/service/#{@name}/logs"
          end

          ######################################################################
          # Memory
          ######################################################################

          def update_memory( args )
            @system_api.post "containers/service/#{@name}/properties/runtime", args
          end

          def memory_metrics
            @system_api.get "containers/service/#{@name}/metrics/memory"
          end

          ######################################################################
          # Services
          ######################################################################

          def available_services
            @system_api.get "service_manager/available_services/managed_engine/#{@name}"
          end

          def persistent_services
            @system_api.get "containers/service/#{@name}/services/persistent/"
          end

          def non_persistent_services
            @system_api.get "containers/service/#{@name}/services/non_persistent/"
          end

          def persistent_services_for( args )
            @system_api.get "containers/service/#{@name}/services/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def register_nonpersistent_service(args)
            @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/register"
          end

          def deregister_nonpersistent_service(args)
            @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/deregister"
          end

          def reregister_nonpersistent_service(args)
            @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/reregister"
          end

          def consumers
            @system_api.get "containers/service/#{@name}/consumers/"
          end

          ######################################################################
          # Actions
          ######################################################################

          def perform_action(args)
            @system_api.post "containers/service/#{@name}/action/#{args[:actionator_name]}", args[:variables]
          end

          ######################################################################
          # Configuration
          ######################################################################

          def configuration(args)
            @system_api.get "containers/service/#{@name}/configuration/#{args[:configurator_name]}"
          end

          def perform_configuration(args)
            @system_api.post "containers/service/#{@name}/configuration/#{args[:configurator_name]}", { variables: args[:variables] }
          end

          ######################################################################
          # Data export/import
          ######################################################################

          def export( out )
          #   @system_api.get "containers/service/#{@name}/export"
          # end
          #
          # def export_persistent_service_stream( out )
            @system_api.stream(
              "containers/service/#{@name}/export"
            ) do |chunk|
             out.write chunk
            end
          end



          def import(file)
            @system_api.put_stream "containers/service/#{@name}/import", file
          end

          ######################################################################
          # Resolve string
          ######################################################################

          def resolve_string(string)
            @system_api.post "containers/service/#{@name}/template", { template_string: string }
          end

          ######################################################################
          # OOM
          ######################################################################

          def clear_had_oom
            @system_api.get "containers/service/#{@name}/clear_error"
          end

        end

      end
    end
  end
end
