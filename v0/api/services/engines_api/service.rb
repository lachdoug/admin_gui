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
#
#           ######################################################################
#           # Blueprint
#           ######################################################################
#
          # def blueprint
          #   @system_api.get "containers/service/#{@name}/blueprint"
          # end
#
#           ######################################################################
#           # Installation
#           ######################################################################
#
#           def build_report
#             @system_api.get "containers/service/#{@name}/build_report"
#           end
#
#           def uninstall(args={})
#             @system_api.delete "containers/service/#{@name}/delete/#{args[:delete_app_data] ? 'all' : 'none'}"
#           end
#
#           ######################################################################
#           # Instructions
#           ######################################################################
#
          def instruct_container(instruction)

            if instruction == "destroy"
              @system_api.delete "containers/service/#{@name}/#{instruction}"
            else
              @system_api.get "containers/service/#{@name}/#{instruction}"
            end
          end
#
          ######################################################################
          # Websites
          ######################################################################

          def websites
            @system_api.get "containers/service/#{@name}/websites"
          end
#
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
#
#           ######################################################################
#           # Network
#           ######################################################################
#
#           def update_network( args )
#             @system_api.post "containers/service/#{@name}/properties/network", args
#           end
#
#           def network_metrics
#             get "containers/service/#{name}/metrics/network", expect: :json
#           end
#
#           ######################################################################
#           # Environment variables
#           ######################################################################
#
#           def update_environment_variables( args )
#             @system_api.post "containers/service/#{@name}/properties/runtime", args
#           end

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
#
#           def create_new_persistent_service( args )
#             byebug
#             @system_api.post "containers/service/#{@name}/services/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}", { variables: args[:variables] }
#           end
#
#           def share_existing_persistent_service( args )
#
#             @system_api.post "containers/service/#{@name}/services/persistent/share/#{args[:parent_engine]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
#           end
#
#           def adopt_orphan_persistent_service( args )
#             @system_api.post "containers/service/#{@name}/services/persistent/orphan/#{args[:parent_engine]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
#           end
#
#           def update_persistent_service( args )
#             @system_api.post "containers/service/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
#           end
#
#           def export_persistent_service( args )
#             @system_api.get "containers/service/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/export"
#           end
#
#           def import_persistent_service( args )
#             @system_api.put_stream "containers/service/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/#{args[:write]}", { file: args[:file] }
#           end
#
#           def register_nonpersistent_service(args)
#             @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/register"
#           end
#
#           def deregister_nonpersistent_service(args)
#             @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/deregister"
#           end
#
#           def reregister_nonpersistent_service(args)
#             @system_api.get "containers/service/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/reregister"
#           end

          ######################################################################
          # Actions
          ######################################################################

          def perform_action(args)
            # byebug
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

#           ######################################################################
#           # Resolve string
#           ######################################################################
#
#           def resolve_string(string)
#             @system_api.post "containers/service/#{@name}/template", { template_string: string }
#           end
#
#           ######################################################################
#           # OOM
#           ######################################################################
#
#           def clear_had_oom
#             @system_api.get "containers/service/#{@name}/clear_error"
#           end
#
        end

      end
    end
  end
end
