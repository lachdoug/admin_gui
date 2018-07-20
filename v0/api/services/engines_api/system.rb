class V0
  module Api
    module Services
      class EnginesApi
        class System

          def initialize(system_api)
            @system_api = system_api
          end

          def sign_in( args )
            @system_api.post 'system/login', {
              user_name: "admin",
              password: args[:password],
              ip_address: args[:ip_address] },
            { timeout: 5 }
          end

          ##########################################################################
          # Status
          ##########################################################################

          def status
            @system_api.get 'system/status', {}, { timeout: 5 }
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
            puts @system_api.post 'system/control/base_os/shutdown', args
          end

          ##########################################################################
          # Admin
          ##########################################################################

          def api_admin_user
            # @system_api.get "system/user/api_admin"
            @system_api.get "system/user/admin"
          end

          def update_api_admin_user_password( args )
            @system_api.post "system/user/api_admin/password", args
          end

          def update_api_admin_user_email( args )
            @system_api.post "system/user/api_admin/email", args
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
          # Region
          ##########################################################################

          def timezone
            @system_api.get 'system/control/base_os/timezone'
          end

          def update_timezone( args )
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

          def update_domain(domain_name, args)
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
          # Sysadmin user settings
          ##########################################################################

          def system_user_settings
            @system_api.get 'system/system_user/settings'
          end

          def update_system_user_settings( args )
            @system_api.post 'system/system_user/settings', args
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
              chunk.split("\n").each do |line|
                yield line
              end
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
          # Users > accounts
          ##########################################################################

          def index_users_accounts
            @system_api.get 'system/uadmin/users/accounts'
          end

          def show_users_account( uid )
            @system_api.get 'system/uadmin/users/accounts/', uid: uid
          end

          def create_users_account( account )
            @system_api.post 'system/uadmin/users/accounts/', account: account
          end

          def update_users_account( uid, account )
            @system_api.put 'system/uadmin/users/accounts/', uid: uid, account: account
          end

          def delete_users_account( uid )
            @system_api.delete 'system/uadmin/users/accounts/', uid: uid
          end

          ##########################################################################
          # Users > groups
          ##########################################################################

          def index_users_groups
            @system_api.get 'system/uadmin/users/groups'
          end

          def show_users_group( group_dn )
            @system_api.get 'system/uadmin/users/groups/', dn: group_dn
          end

          ##########################################################################
          # Users > accounts > groups
          ##########################################################################

          def delete_users_account_groups( user_uid, group_dns )
            @system_api.delete 'system/uadmin/users/accounts/groups', user_uid: user_uid, group_dns: group_dns
          end

          def new_users_account_groups( user_uid )
            @system_api.get 'system/uadmin/users/accounts/groups/new', user_uid: user_uid
          end

          def create_users_account_groups( user_uid, group_dns )
            @system_api.post 'system/uadmin/users/accounts/groups', user_uid: user_uid, group_dns: group_dns
          end

          ##########################################################################
          # Users > accounts > email
          ##########################################################################

          def create_users_account_email( user_uid, email )
            @system_api.post 'system/uadmin/users/accounts/email', user_uid: user_uid, email: email
          end

          def edit_users_account_email( user_uid )
            @system_api.get 'system/uadmin/users/accounts/email/edit', user_uid: user_uid
          end

          def update_users_account_email( user_uid, email )
            @system_api.put 'system/uadmin/users/accounts/email', user_uid: user_uid, email: email
          end

          def delete_users_account_email( user_uid )
            @system_api.delete 'system/uadmin/users/accounts/email', user_uid: user_uid
          end

          ########################################################################
          # Users > accounts > email > distribution groups
          ########################################################################

          def new_users_account_email_distribution_group( user_uid )
            @system_api.get 'system/uadmin/users/accounts/email/distribution_groups/new', user_uid: user_uid
          end

          def create_users_account_email_distribution_group( user_uid, distribution_group )
            @system_api.post 'system/uadmin/users/accounts/email/distribution_groups/', user_uid: user_uid, distribution_group: distribution_group
          end

          def delete_users_email_distribution_group( user_uid, address )
            @system_api.delete 'system/uadmin/users/accounts/email/distribution_groups/', user_uid: user_uid, address: address
          end

          ########################################################################
          # Users > accounts > email > aliases
          ########################################################################

          def create_users_email_alias( user_uid, email_alias )
            @system_api.post 'system/uadmin/users/accounts/email/aliases/', user_uid: user_uid, alias: email_alias
          end

          def delete_users_email_alias( user_uid, address )
            @system_api.delete 'system/uadmin/users/accounts/email/aliases/', user_uid: user_uid, address: address
          end

          ##########################################################################
          # Users > accounts > password
          ##########################################################################

          def update_users_account_password( user_uid, password )
            @system_api.put 'system/uadmin/users/accounts/password', user_uid: user_uid, password: password
          end

          ########################################################################
          # Email
          ########################################################################

          def show_email
            @system_api.get 'system/uadmin/email'
          end

          ########################################################################
          # Email > default domain
          ########################################################################

          def create_email_default_domain( default_domain )
            @system_api.post 'system/uadmin/email/default_domain', default_domain: default_domain
          end

          def update_email_default_domain( default_domain )
            @system_api.put 'system/uadmin/email/default_domain', default_domain: default_domain
          end

          ########################################################################
          # Email > domains
          ########################################################################

          def create_email_domain( domain )
            @system_api.post 'system/uadmin/email/domains/', domain: domain
          end

          def delete_email_domain( name )
            @system_api.delete 'system/uadmin/email/domains/', name: name
          end

          ########################################################################
          # Email > email addresses
          ########################################################################

          def index_email_email_addresses
            @system_api.get 'system/uadmin/email/email_addresses'
          end

          ########################################################################
          # Email > distribution groups
          ########################################################################

          def index_email_distribution_groups
            @system_api.get 'system/uadmin/email/distribution_groups'
          end

          def show_email_distribution_group( name )
            @system_api.get 'system/uadmin/email/distribution_groups/', name: name
          end

          def new_email_distribution_group
            @system_api.get 'system/uadmin/email/distribution_groups/new'
          end

          def create_email_distribution_group( distribution_group )
            @system_api.post 'system/uadmin/email/distribution_groups/', distribution_group: distribution_group
          end

          def edit_email_distribution_group( name )
            @system_api.get 'system/uadmin/email/distribution_groups/edit', name: name
          end

          def update_email_distribution_group( name, distribution_group )
            @system_api.put 'system/uadmin/email/distribution_groups/', name: name, distribution_group: distribution_group
          end

          def delete_email_distribution_group( name )
            @system_api.delete 'system/uadmin/email/distribution_groups/', name: name
          end

          ########################################################################
          # Email > distribution groups > email addresses
          ########################################################################

          # def new_email_distribution_group_email_address( distribution_group_name )
          #   @system_api.get 'system/uadmin/email/distribution_groups/email_addresses/new', distribution_group_name: distribution_group_name
          # end
          #
          # def create_email_distribution_group_email_address( distribution_group_name, email_address )
          #   @system_api.post 'system/uadmin/email/distribution_groups/email_addresses/', distribution_group_name: distribution_group_name, email_address: email_address
          # end
          #
          # def delete_email_distribution_group_email_address( distribution_group_name, address )
          #   @system_api.delete 'system/uadmin/email/distribution_groups/email_addresses/', distribution_group_name: distribution_group_name, address: address
          # end

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

          def update_service_certificate( args )
            # args includes keys: :service_name, :store_name, :cert_name
            @system_api.post "system/certs/what_route_for_updating_service_certs", args
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
