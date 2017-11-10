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

          def delete_existing_persistent_service( args )
            # byebug
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

          def export_persistent_service( args )
            @system_api.get "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/export"
          end

          def import_persistent_service( args )
            @system_api.put_stream "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/#{args[:write]}", { file: args[:file] }
          end

          def create_nonpersistent_service( args )
            # byebug
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
#     def uninstall(args={})
#       @system_api.delete "containers/engine/#{@name}/delete/#{args[:remove_data] ? 'all' : 'none'}"
#     end
#
#     # properties
#
#     def set_runtime_properties(args)
#       @system_api.post "containers/engine/#{@name}/properties/runtime", args
#     end
#
#     def set_network_properties(args)
#       @system_api.post "containers/engine/#{@name}/properties/network", args
#     end
#
#     # services
#
#     def persistent_services
#       @system_api.get "containers/engine/#{@name}/services/persistent/"
#     end
#
#     def persistent_services_for_definition_path(definition_path)
#       @system_api.get "containers/engine/#{@name}/services/persistent/#{definition_path}"
#     end
#
#     def non_persistent_services
#       @system_api.get "containers/engine/#{@name}/services/non_persistent/"
#     end
#
#     def non_persistent_services_for_definition_path(definition_path)
#       @system_api.get "containers/engine/#{@name}/services/non_persistent/#{definition_path}"
#     end
#
#     def available_services
#       @system_api.get "service_manager/available_services/managed_engine/#{@name}"
#     end
#
#     def available_subservices_for(definition_path)
#       publisher_namespace, type_path = definition_path.split('/', 2)
#       @system_api.get "service_manager/available_services/type/#{type_path}"
#     end
#
#     def create_persistent_service_consumer_subservice_consumer(args)
#       publisher_namespace, type_path = args[:definition_path].split('/', 2)
#       @system_api.post "containers/service/#{args[:service_name]}/sub_services/#{@name}/#{args[:parent_service_handle]}",
#         args: { publisher_namespace: publisher_namespace,
#           type_path: type_path,
#           variables: args[:variables] }
#     end
#
#     def update_persistent_service_consumer(args)
#       @system_api.post "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", args: { variables: args[:variables] }
#     end
#
#     def update_non_persistent_service_consumer(args)
#       @system_api.post "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", args: { variables: args[:variables] }
#     end
#
#     def update_persistent_service_consumer_share(args)
#       @system_api.post "containers/engine/#{@name}/service/persistent/shared/#{args[:parent_engine]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}", args: { variables: args[:variables] }
#     end
#
#     def register_non_persistent_service_consumer(args)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/register"
#     end
#
#     def reregister_non_persistent_service_consumer(args)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/reregister"
#     end
#
#     def deregister_non_persistent_service_consumer(args)
#       @system_api.get "containers/engine/#{@name}/service/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/deregister"
#     end
#
#     def remove_persistent_service_consumer(args)
#       @system_api.delete "containers/engine/#{@name}/services/persistent/#{args[:remove_data] ? 'all' : 'none'}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}"
#     end
#
#     def remove_non_persistent_service_consumer(args)
#       @system_api.delete "containers/engine/#{@name}/services/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}"
#     end
#
#     def remove_persistent_service_consumer_share(args)
#       @system_api.delete "containers/engine/#{@name}/services/persistent/shared/#{args[:parent_engine]}/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}"
#     end
#
#

#
#     def create_non_persistent_service_consumer(args)
#       @system_api.post "containers/engine/#{@name}/services/non_persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/", args: { variables: args[:variables] }
#     end
#
#     # persistent services import/export
#
#     def persistent_service_consumer_export(args)
#       @system_api.get "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/export"
#     end
#
#     def persistent_service_consumer_import(args)
#       put_file "containers/engine/#{@name}/service/persistent/#{args[:publisher_namespace]}/#{args[:type_path]}/#{args[:service_handle]}/#{args[:write]}", file: args[:data_file]
#     end
#
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
#     def perform_actionator_for(actionator_name, args, return_type)
#       @system_api.post "containers/engine/#{@name}/action/#{actionator_name}", args
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
