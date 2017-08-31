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
          # Installation
          ######################################################################

          def build_report
            @system_api.get "containers/engine/#{@name}/build_report"
          end

          def uninstall(params={})
            @system_api.delete "containers/engine/#{@name}/delete/#{params[:delete_app_data] ? 'all' : 'none'}"
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

          def update_network( params )
            @system_api.post "containers/engine/#{@name}/properties/network", params
          end

          def network_metrics
            get "containers/engine/#{name}/metrics/network", expect: :json
          end

          ######################################################################
          # Memory
          ######################################################################

          def update_memory( params )
            @system_api.post "containers/engine/#{@name}/properties/runtime", params
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

        end

      end
    end
  end
end


# module EnginesSystemCore
#   class CoreApp
#
#     include CoreApi::ApiCall
#
#     def initialize(system_url, token, name)
#       @system_url = system_url
#       @token = token
#       @name = name
#     end
#
#     attr_reader :name
#
#     # detail
#
#     def container
#       @system_api.get "containers/engine/#{@name}"
#     end
#
#     def container_processes
#       @system_api.get "containers/engine/#{@name}/ps"
#     end
#
#     def blueprint
#       @system_api.get "containers/engine/#{@name}/blueprint"
#     end
#
#     def build_report
#       @system_api.get "containers/engine/#{@name}/build_report"
#     end
#
#     # state
#
#     def state
#       @system_api.get "containers/engine/#{@name}/state"
#     end
#
#     def status
#       @system_api.get "containers/engine/#{@name}/status"
#     end
#
#     def clear_had_oom
#       @system_api.get "containers/engine/#{@name}/clear_error"
#     end
#
#
#     # instructions
#
#     def stop
#       @system_api.get "containers/engine/#{@name}/stop"
#     end
#
#     def start
#       @system_api.get "containers/engine/#{@name}/start"
#     end
#
#     def pause
#       @system_api.get "containers/engine/#{@name}/pause"
#     end
#
#     def unpause
#       @system_api.get "containers/engine/#{@name}/unpause"
#     end
#
#     def restart
#       @system_api.get "containers/engine/#{@name}/restart"
#     end
#
#     def create
#       @system_api.get "containers/engine/#{@name}/create"
#     end
#
#     def recreate
#       @system_api.get "containers/engine/#{@name}/recreate"
#     end
#
#     def destroy
#       @system_api.delete "containers/engine/#{@name}/destroy"
#     end
#
#     def reinstall
#       @system_api.get "containers/engine/#{@name}/reinstall"
#     end
#
#     def uninstall(params={})
#       @system_api.delete "containers/engine/#{@name}/delete/#{params[:remove_data] ? 'all' : 'none'}"
#     end
#
#     # properties
#
#     def set_runtime_properties(params)
#       @system_api.post "containers/engine/#{@name}/properties/runtime", params
#     end
#
#     def set_network_properties(params)
#       @system_api.post "containers/engine/#{@name}/properties/network", params
#     end
#
#     # services
#
#     def persistent_services
#       @system_api.get "containers/engine/#{@name}/services/persistent/"
#     end
#
#     def persistent_services_for_publisher_type_path(publisher_type_path)
#       @system_api.get "containers/engine/#{@name}/services/persistent/#{publisher_type_path}"
#     end
#
#     def non_persistent_services
#       @system_api.get "containers/engine/#{@name}/services/non_persistent/"
#     end
#
#     def non_persistent_services_for_publisher_type_path(publisher_type_path)
#       @system_api.get "containers/engine/#{@name}/services/non_persistent/#{publisher_type_path}"
#     end
#
#     def available_services
#       @system_api.get "service_manager/available_services/managed_engine/#{@name}"
#     end
#
#     def available_subservices_for(publisher_type_path)
#       publisher_namespace, type_path = publisher_type_path.split('/', 2)
#       @system_api.get "service_manager/available_services/type/#{type_path}"
#     end
#
#     def create_persistent_service_consumer_subservice_consumer(params)
#       publisher_namespace, type_path = params[:publisher_type_path].split('/', 2)
#       @system_api.post "containers/service/#{params[:service_name]}/sub_services/#{@name}/#{params[:parent_service_handle]}",
#         params: { publisher_namespace: publisher_namespace,
#           type_path: type_path,
#           variables: params[:variables] }
#     end
#
#     def update_persistent_service_consumer(params)
#       @system_api.post "containers/engine/#{@name}/service/persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}", params: { variables: params[:variables] }
#     end
#
#     def update_non_persistent_service_consumer(params)
#       @system_api.post "containers/engine/#{@name}/service/non_persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}", params: { variables: params[:variables] }
#     end
#
#     def update_persistent_service_consumer_share(params)
#       @system_api.post "containers/engine/#{@name}/service/persistent/shared/#{params[:parent_engine]}/#{params[:publisher_type_path]}/#{params[:service_handle]}", params: { variables: params[:variables] }
#     end
#
#     def register_non_persistent_service_consumer(params)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}/register"
#     end
#
#     def reregister_non_persistent_service_consumer(params)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}/reregister"
#     end
#
#     def deregister_non_persistent_service_consumer(params)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}/deregister"
#     end
#
#     def remove_persistent_service_consumer(params)
#       @system_api.delete "containers/engine/#{@name}/services/persistent/#{params[:remove_data] ? 'all' : 'none'}/#{params[:publisher_type_path]}/#{params[:service_handle]}"
#     end
#
#     def remove_non_persistent_service_consumer(params)
#       @system_api.delete "containers/engine/#{@name}/services/non_persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}"
#     end
#
#     def remove_persistent_service_consumer_share(params)
#       @system_api.delete "containers/engine/#{@name}/services/persistent/shared/#{params[:parent_engine]}/#{params[:publisher_type_path]}/#{params[:service_handle]}"
#     end
#
#
#     def create_persistent_service_consumer(params)
#       @system_api.post "containers/engine/#{@name}/services/persistent/#{params[:publisher_type_path]}", params: { variables: params[:variables] }
#     end
#
#     def create_persistent_service_consumer_share(params)
#       @system_api.post "containers/engine/#{@name}/services/persistent/share/#{params[:parent_engine]}/#{params[:publisher_type_path]}/#{params[:service_handle]}", params: { variables: params[:variables] }
#     end
#
#     def create_persistent_service_consumer_orphan(params)
#       @system_api.post "containers/engine/#{@name}/services/persistent/orphan/#{params[:parent_engine]}/#{params[:publisher_type_path]}/#{params[:service_handle]}", params: { variables: params[:variables] }
#     end
#
#     def create_non_persistent_service_consumer(params)
#       @system_api.post "containers/engine/#{@name}/services/non_persistent/#{params[:publisher_type_path]}/", params: { variables: params[:variables] }
#     end
#
#     # persistent services import/export
#
#     def persistent_service_consumer_export(params)
#       @system_api.get "containers/engine/#{@name}/service/persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}/export"
#     end
#
#     def persistent_service_consumer_import(params)
#       put_file "containers/engine/#{@name}/service/persistent/#{params[:publisher_type_path]}/#{params[:service_handle]}/#{params[:write]}", file: params[:data_file]
#     end
#
#     # resolve string
#
#     def resolve_string(string)
#       @system_api.post "containers/engine/#{@name}/template", params: {template_string: string}
#     end
#
#     # actions
#
#     def actionators
#       @system_api.get "containers/engine/#{@name}/actions/"
#     end
#
#     def actionator_for(actionator_name)
#       @system_api.get "containers/engine/#{@name}/action/#{actionator_name}"
#     end
#
#     def perform_actionator_for(actionator_name, params, return_type)
#       @system_api.post "containers/engine/#{@name}/action/#{actionator_name}", params
#     end
#
#     # logs
#
#     def logs
#       @system_api.get "containers/engine/#{@name}/logs"
#     end
#
#     #memory
#
#     def memory_metrics
#       @system_api.get "containers/engine/#{@name}/metrics/memory"
#     end
#
#     #network
#
#     def network_metrics
#       @system_api.get "containers/engine/#{@name}/metrics/network"
#     end
#
#   end
# end
