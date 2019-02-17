class V0
  module Api
    module Services
      class EnginesApi
        class App

          def initialize(system_api, name)
            @system_api = system_api
            @name = name
          end

          def container
             @system_api.get "containers/engine/#{@name}"
          end

          ######################################################################
          # Blueprint
          ######################################################################

          def blueprint
            @system_api.get "containers/engine/#{@name}/blueprint"
          end

          ######################################################################
          # Icon
          ######################################################################

          def icon_url
            @system_api.get "containers/engine/#{@name}/icon_url"
          end

          def update_icon_url(args)
            @system_api.post "containers/engine/#{@name}/icon_url", args
          end

          ######################################################################
          # Installation
          ######################################################################

          def build_report
            @system_api.get "containers/engine/#{@name}/build_report"
          end

          def uninstall(args={})

            @system_api.delete "containers/engine/#{@name}/delete/#{args[:delete_app_data] ? 'all' : 'none'}"
          end

          ######################################################################
          # Instructions
          ######################################################################

          def instruct_container(instruction)
            if instruction == "destroy"
              @system_api.delete "containers/engine/#{@name}/#{instruction}"
            else
              @system_api.get "containers/engine/#{@name}/#{instruction}"
            end
            return true
          end

          ######################################################################
          # Websites
          ######################################################################

          def websites
            @system_api.get "containers/engine/#{@name}/websites"
          end

          ######################################################################
          # Processes
          ######################################################################

          def processes
            @system_api.get "containers/engine/#{@name}/ps"
          end

          ######################################################################
          # Logs
          ######################################################################

          def logs
            @system_api.get "containers/engine/#{@name}/logs"
          end

          ######################################################################
          # Network
          ######################################################################

          def update_network( args )
            @system_api.post "containers/engine/#{@name}/properties/network", args
          end

          def network_metrics
            get "containers/engine/#{name}/metrics/network", expect: :json
          end

          ######################################################################
          # Environment variables
          ######################################################################

          def update_environment_variables( args )
            @system_api.post "containers/engine/#{@name}/properties/runtime", args
          end

          ######################################################################
          # Memory
          ######################################################################

          def update_memory( args )
            @system_api.post "containers/engine/#{@name}/properties/runtime", args
          end

          def memory_metrics
            @system_api.get "containers/engine/#{@name}/metrics/memory"
          end

          ######################################################################
          # Services
          ######################################################################

          def available_services
            @system_api.get "service_manager/available_services/managed_engine/#{@name}"
          end

          def persistent_services
            @system_api.get "containers/engine/#{@name}/services/persistent/"
          end

          def non_persistent_services
            @system_api.get "containers/engine/#{@name}/services/non_persistent/"
          end

          def persistent_services_for( args )
            @system_api.get "containers/engine/#{@name}/services/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def nonpersistent_services_for( args )
            @system_api.get "containers/engine/#{@name}/services/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def delete_existing_persistent_service( args )
            @system_api.delete "containers/engine/#{@name}/services/persistent/#{ args[:delete_data] == true ? 'all' : 'none' }/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}"
          end

          def create_new_persistent_service( args )
            @system_api.post "containers/engine/#{@name}/services/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}", { variables: args[:variables] }
          end

          def share_existing_persistent_service( args )
            @system_api.post "containers/engine/#{@name}/services/persistent/share/#{args[:parent]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
          end

          def adopt_orphan_persistent_service( args )
            @system_api.post "containers/engine/#{@name}/services/persistent/orphan/#{args[:parent]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
          end

          def update_persistent_service( args )
            @system_api.post "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
          end

          def export_persistent_service_stream( args, out )
            @system_api.stream(
              "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/export"
            ) do |chunk|
             out.write chunk
            end
          end

          def export_persistent_service( args )
            @system_api.get "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/export"
          end

          def import_persistent_service( args )
            @system_api.put_stream "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/#{args[:write]}", args[:file]
          end

          def create_nonpersistent_service( args )
            @system_api.post "containers/engine/#{@name}/services/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}", { variables: args[:variables] }
          end

          def register_nonpersistent_service(args)
            @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/register"
          end

          def deregister_nonpersistent_service(args)
            @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/deregister"
          end

          def reregister_nonpersistent_service(args)
            @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/reregister"
          end

          def update_nonpersistent_service( args )
            @system_api.post "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", { variables: args[:variables] }
          end

          def delete_nonpersistent_service( args )
            @system_api.delete "containers/engine/#{@name}/services/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}"
          end

          def subservices_for( service_container_name, service_handle )
            @system_api.get "containers/service/#{service_container_name}/sub_services/#{@name}/#{service_handle}" #, { engine_name: @name, service_handle: service_handle }
          end

          def available_subservices_for( args )
            @system_api.get "service_manager/available_services/type/#{args[:type_path]}"
          end

          def create_subservice( args )
            @system_api.post "containers/service/#{ args[:service_container_name] }/sub_services/#{@name}/#{args[:service_handle]}/#{args[:sub_handle]}",
            {
              publisher_namespace: args[:sub_publisher_namespace],
              type_path: args[:sub_type_path],
              variables: args[:variables]
            }
          end



          ######################################################################
          # Actions
          ######################################################################

          def perform_action(args)
            @system_api.post "containers/engine/#{@name}/action/#{args[:actionator_name]}", args[:variables]
          end

          ######################################################################
          # Resolve string
          ######################################################################

          def resolve_string(string)
            @system_api.post "containers/engine/#{@name}/template", { template_string: string }
          end

          ######################################################################
          # OOM
          ######################################################################

          def clear_had_oom
            @system_api.get "containers/engine/#{@name}/clear_error"
          end

        end

      end
    end
  end
end
