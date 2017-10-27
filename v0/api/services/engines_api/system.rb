class V0
  module Api
    module Services
      class EnginesApi
        class System

          def initialize(system_api)
            @system_api = system_api
          end

          def sign_in( args )
            @system_api.post 'system/login', { user_name: args[:username], password: args[:password] }
          end

          ##########################################################################
          # Status
          ##########################################################################

          def status
            @system_api.get 'system/status'
          end

          def builder_status
            @system_api.get 'engine_builder/status'
          end

          def app_statuses
            @system_api.get 'containers/engines/status'
          end

          def service_statuses
            @system_api.get 'containers/services/status'
          end

          def builder_status
            @system_api.get 'engine_builder/status'
          end

          def update_status
            @system_api.get 'system/status/update'
          end

          ##########################################################################
          # Restart
          ##########################################################################

          def restart_engines
            @system_api.get 'system/control/engines_system/restart'
          end

          def restart_base_os
            @system_api.get 'system/control/base_os/restart'
          end

          def shutdown( args )
            # return 'true'
            @system_api.post 'system/control/base_os/shutdown', args
          end

          ##########################################################################
          # Admin
          ##########################################################################

          def update_admin_user( args )
            @system_api.post "system/user/admin", args
          end

          def admin_user
            @system_api.get "system/user/admin"
          end

          ##########################################################################
          # Update
          ##########################################################################

          def update_engines
            @system_api.get 'system/control/engines_system/update'
          end

          def update_base_os
            @system_api.get 'system/control/base_os/update'
          end

          ##########################################################################
          # Version
          ##########################################################################

          def engines_version
            @system_api.get 'system/version/system'
          end

          def base_os_version
            @system_api.get 'system/version/base_os'
          end

          ##########################################################################
          # Localization
          ##########################################################################

          def timezone
            @system_api.get 'system/control/base_os/timezone'
          end

          def update_timezone( args )
            # timezone = ActiveSupport::TimeZone.find_tzinfo(timezone).to_s.sub(' - ', '/')
            @system_api.post 'system/control/base_os/timezone', args
          end

          def locale
            @system_api.get 'system/control/base_os/locale'
          end

          def update_locale( args )
            @system_api.post 'system/control/base_os/locale', args
          end

          ##########################################################################
          # Domains
          ##########################################################################

          def domains
            @system_api.get 'system/domains/'
          end

          def default_domain
            @system_api.get 'system/config/default_domain'
          end

          def update_default_domain( args )
            @system_api.post 'system/config/default_domain', args
          end

          def create_domain( args )
            @system_api.post 'system/domains/', args
          end

          def domain(domain_name)
            @system_api.get "system/domain/#{domain_name}"
          end

          def update_domain(domain_name, args) # TODO: put domain into args
            @system_api.post "system/domain/#{domain_name}", args
          end

          def delete_domain(domain_name)
            @system_api.delete "system/domains/#{domain_name}"
          end

          ##########################################################################
          # Keys
          ##########################################################################

          def public_ssh_key
            @system_api.get 'system/keys/user/engines'
          end

          def update_public_ssh_key( args )
            @system_api.post 'system/keys/user/engines', args
          end

          def private_ssh_key
            @system_api.get 'system/keys/user/engines/generate'
          end

          ##########################################################################
          # Default site
          ##########################################################################

          def default_site
            @system_api.get 'system/config/default_site'
          end

          def update_default_site( args )
            @system_api.post 'system/config/default_site', args
          end

          ##########################################################################
          # Events
          ##########################################################################

          def container_event_stream
            @system_api.stream(
            "containers/events/stream") do |chunk|
              chunk.split("\n").each do |line|
                yield line
              end
            end
          end

          def builder_log_event_stream
            @system_api.stream(
            "engine_builder/follow_stream") do |chunk|
              # begin
                chunk.split("\n").each do |line|
                  yield line
                end
              # rescue => e
                # yield "\n\n\n\u001b[91m+++++++++++++Build log error... #{e}\n\n\n"
              # end
            end
          end

          ##########################################################################
          # Service manager
          ##########################################################################

          def service_definition_for( args )
            @system_api.get "service_manager/service_definitions/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def shareable_service_consumers_for( args )
            @system_api.get "service_manager/persistent_services/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def adoptable_service_consumers_for( args )
            @system_api.get "service_manager/orphan_services/#{args[:publisher_namespace]}/#{args[:type_path]}"
          end

          def orphan_data
            @system_api.get "service_manager/orphan_services/"
          end

          def delete_orphan_data( orphan_path )
            @system_api.delete "service_manager/orphan_service/#{orphan_path}"
          end

          ##########################################################################
          # Install app
          ##########################################################################

          def install( args )

            @system_api.post 'containers/engines/build', args
          end

          def current_build
            @system_api.get 'engine_builder/params'
          end

          def last_build_params
            @system_api.get 'engine_builder/last_build/params'
          end

          def last_build_log
            @system_api.get 'engine_builder/last_build/log'
          end

          ##########################################################################
          # Reserved
          ##########################################################################

          def reserved_container_names
            @system_api.get 'system/reserved/engine_names'
          end

          def reserved_fqdns
            @system_api.get 'system/reserved/hostnames'
          end

          ##########################################################################
          # Statistics
          ##########################################################################

          def container_memory_statistics
            @system_api.get 'system/metrics/memory/statistics'
          end

          def system_memory_statistics
            @system_api.get 'system/metrics/memory'
          end

          def cpu_statistics
            @system_api.get 'system/metrics/load'
          end

          def disk_statistics
            @system_api.get 'system/metrics/disks'
          end

          def network_statistics
            @system_api.get 'system/metrics/network'
          end

          ##########################################################################
          # Registry
          ##########################################################################

          def registry_configurations
            @system_api.get 'registry/configurations/'
          end

          def registry_apps
            @system_api.get 'registry/engines/'
          end

          def registry_services
            @system_api.get 'registry/services/'
          end

          def registry_orphans
            @system_api.get 'registry/orphans/'
          end

          def registry_shares
            @system_api.get 'registry/shares/'
          end

          ######################################################################
          # Certificates
          ######################################################################

          def certificates
            @system_api.get 'system/certs/'
          end

          # certificate_path is :store/:certificate_name
          def certificate(certificate_path)
            @system_api.get "system/certs/#{certificate_path}"
          end

          def delete_certificate(certificate_path)

            @system_api.delete "system/certs/#{certificate_path}"
          end

          def certificate_authority
            @system_api.get "system/certs/system_ca"
          end

          def create_default_certificate( args )
            @system_api.post 'system/certs/default', args
          end

          def create_service_certificate( args )
            @system_api.post 'system/certs/', args
          end

          def service_certificates
            @system_api.get 'system/certs/service_certs'
          end

          # service_certificate_path is :service_name/:certificate_name
          def update_service_certificate(service_certificate_path)
            @system_api.post "system/certs/default/#{service_certificate_path}"
          end

          ######################################################################
          # Exception logging
          ######################################################################

          def report_exceptions
            @system_api.get 'system/config/remote_exception_logging'
          end

          def enable_exception_reporting
            @system_api.post 'system/config/remote_exception_logging/enable'
          end

          def disable_exception_reporting
            @system_api.post 'system/config/remote_exception_logging/disable'
          end


        end

      end
    end
  end
end

    # module EnginesApiCore
    #   class CoreSystem
    #
    #     include CoreApi::ApiCall
    #     include CoreApi::ApiStream
    #     include EventStreams
    #
    #     def initialize(system_url, token, name)
    #       @system_url = system_url
    #       @token = token
    #       @name = name
    #     end
    #
    #     # admin
    #
    #     def update_password(params)
    #       post "system/user/admin", params: params.merge({ username: 'admin', current_password: params[:current_password], new_password: params[:new_password]}), expect: :boolean
    #     end
    #
    #     def update_email(params)
    #       post "system/user/admin", params: { username: 'admin', current_password: params[:current_password], email: params[:email] }, expect: :boolean
    #     end
    #
    #     def admin_user
    #       get "system/user/admin", expect: :json
    #     end
    #
    #     # authentication
    #
    #     def authenticate(password)
    #       post "system/login", params: { username: 'admin', password: password }, expect: :plain_text
    #     end
    #
    #
    #     # container statuses
    #
    #     def engine_statuses
    #       get 'containers/engines/status', expect: :json
    #     end
    #
    #     def service_statuses
    #       get 'containers/services/status', expect: :json
    #     end
    #

    #
    #     # install apps
    #
    #     def build_app(params)
    #       post 'containers/engines/build', params: params, expect: :boolean
    #     end
    #
    #     def current_build_params
    #       get 'engine_builder/params', expect: :json
    #     end
    #
    #     def last_build_params
    #       get 'engine_builder/last_build/params', expect: :json
    #     end
    #
    #     def last_build_log
    #       get 'engine_builder/last_build/log', expect: :plain_text
    #     end
    #

    #
    #     # localization
    #
    #     def timezone
    #       get 'system/control/base_os/timezone', expect: :plain_text
    #     end
    #
    #     def update_timezone(timezone)
    #       timezone = ActiveSupport::TimeZone.find_tzinfo(timezone).to_s.sub(' - ', '/')
    #       post 'system/control/base_os/timezone', params: {timezone: timezone}, expect: :boolean
    #     end
    #
    #     def locale
    #       get 'system/control/base_os/locale', expect: :json
    #     end
    #
    #     def update_locale(lang_code, country_code)
    #       post 'system/control/base_os/locale', params: {lang_code: lang_code, country_code: country_code} , expect: :boolean
    #     end
    #
    #     # logs
    #
    #     def logs
    #       { stdout: 'Logs are not available.', stderr: 'Logs are not available.' }
    #     end
    #
    #     # registries
    #
    #     def registry_configurations
    #       get 'registry/configurations/', expect: :json
    #     end
    #
    #     def registry_apps
    #       get 'registry/engines/', expect: :json
    #     end
    #
    #     def registry_services
    #       get 'registry/services/', expect: :json
    #     end
    #
    #     def registry_orphans
    #       get 'registry/orphans/', expect: :json
    #     end
    #
    #     def registry_shares
    #       get 'registry/shares/', expect: :json
    #     end
    #
    #     # reserved
    #
    #     def reserved_container_names
    #       get 'system/reserved/engine_names', expect: :json
    #     end
    #
    #     def reserved_fqdns
    #       get 'system/reserved/hostnames', expect: :json
    #     end
    #
    #     def reserved_ports
    #       get 'system/reserved/ports', expect: :json
    #     end
    #

    #
    #     # service manager
    #
    #     def service_definition_for(publisher_type_path)
    #       get "service_manager/service_definitions/#{publisher_type_path}", expect: :json
    #     end
    #
    #     def persistent_service_connections_for(publisher_type_path)
    #       get "service_manager/persistent_services/#{publisher_type_path}", expect: :json
    #     end
    #
    #     def orphan_service_connections_for(publisher_type_path)
    #       get "service_manager/orphan_services/#{publisher_type_path}", expect: :json
    #     end
    #

    #
    #     # statistics
    #
    #     def container_memory_statistics
    #       get 'system/metrics/memory/statistics', expect: :json
    #     end
    #
    #     def system_memory_statistics
    #       get 'system/metrics/memory', expect: :json
    #     end
    #
    #     def cpu_statistics
    #       get 'system/metrics/load', expect: :json
    #     end
    #
    #     def disk_statistics
    #       get 'system/metrics/disks', expect: :json
    #     end
    #
    #     def network_statistics
    #       get 'system/metrics/network', expect: :json
    #     end
    #
    #     # status
    #
    #     def builder_status
    #       get 'engine_builder/status', expect: :json
    #     end
    #
    #     def system_status
    #       get 'system/status', expect: :json
    #     end
    #
    #     def system_update_status
    #       get 'system/status/update', expect: :json
    #     end
    #
    #     def first_run_required?
    #       raise WTF
    #       # get 'system/status/first_run_required', expect: :boolean
    #     end
    #
    #     # updates
    #
    #     def update_engines
    #       get 'system/control/engines_system/update', expect: :boolean
    #       # false
    #     end
    #
    #     def update_base_os
    #       get 'system/control/base_os/update', expect: :boolean
    #       # true
    #     end
    #
    #     # versions
    #
    #     def engines_version
    #       get 'system/version/system', expect: :plain_text
    #     end
    #
    #     def base_system_version
    #       get 'system/version/base_os', expect: :json
    #     end
    #
    #   end
    # end
