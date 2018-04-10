class V0
  module Api
    module Models
      class System

        def initialize(url, token, settings)
          @url = url
          @token = token
          @settings = settings
        end
        attr_reader :url, :api

        ########################################################################
        # System resources
        ########################################################################

        def app( app_name )
          App.new( self, app_name )
        end

        def service( service_name )
          Service.new( self, service_name )
        end

        def new_app( blueprint_url )
          NewApp.new( self, blueprint_url ).to_h
        end

        ########################################################################
        # Engines API for system
        ########################################################################

        def engines_api
          @engines_api ||= Services::EnginesApi.new( @url, @token, @settings )
        end

        def engines_api_system
          @engines_api_system ||= engines_api.system
        end

        ########################################################################
        # System summary
        ########################################################################

        def to_json(opts={})
          to_h(opts).to_json
        end

        def to_h(opts={})

          raise ( NonFatalError.new nil, 503, { behavior: :engines_update } ) \
            if status[:is_engines_system_updating]
          raise ( NonFatalError.new nil, 503, { behavior: :base_os_update } ) \
            if status[:is_base_system_updating]
          raise ( NonFatalError.new nil, 503, { behavior: :base_os_restart } ) \
            if status[:is_rebooting]

          include_software_titles = opts[:include_software_titles] || false;
          include_services = opts[:include_services] || false;

          {
            url: url,
            status: status,
            report_exceptions: report_exceptions,
            properties: {
              label: {
                text: @settings.banner_text,
                color: @settings.banner_text_color,
                background_color: @settings.banner_background_color
              },
              version: {
                engines: engines_api_system.engines_version,
                base_os: engines_api_system.base_os_version
              },
            },
            builder: {
              status: engines_api_system.builder_status,
              current: current_build
            },
            # apps: app_statuses( include_software_titles: include_software_titles ),
            # services: include_services ? service_statuses( include_software_titles: include_software_titles ) : []
          }

        # rescue => e
        #
        #   # raise NonFatalError.new "System busy.", 503 if e.status_code == 405
        #   raise e
        end

        ########################################################################
        # Auth
        ########################################################################

        def sign_in(params)
          engines_api_system.sign_in params
        rescue NonFatalError => e
          # cusotmize error messages for signin
          if e.status_code == 401
            raise NonFatalError.new "Invalid password.", 401
          elsif e.status_code == 502
            raise NonFatalError.new "Failed to connect to system.\n\nPlease check that the system is running and accessable on the network at the URL provided.", 502
          else
            raise e
          end
        end

        def sign_out
          engines_api_system.sign_out
        end

        ########################################################################
        # Admin user
        ########################################################################

        def update_admin_user(data)
          engines_api_system.update_admin_user( data )
        end

        def admin_user
          engines_api_system.admin_user
        end

        ########################################################################
        # Status
        ########################################################################

        def status
          @status ||= engines_api_system.status
        end

        def app_statuses(opts={})
          engines_api_system.app_statuses.sort.map do |k,v|
            if opts[:include_software_titles]
              display = app(k).about.dig(:software, :display) || {}
              title = display[:label] || display[:title]
            else
              title = nil
            end
            { name: k, title: title }.merge v
          end
        end

        def service_statuses(opts={})
          engines_api_system.service_statuses.sort.map do |k,v|
            if opts[:include_software_titles]
              title = service(k).about[:title]
            else
              title = nil
            end
            { name: k, title: title }.merge v
          end
        end

        ########################################################################
        # Reserved names
        ########################################################################

        def reserved_container_names
          engines_api_system.reserved_container_names
        end

        def reserved_fqdns
          engines_api_system.reserved_fqdns
        end

        ########################################################################
        # Statistics
        ########################################################################

        def statistics
          {
            system_memory_statistics: engines_api_system.
                                            system_memory_statistics,
            container_memory_statistics: engines_api_system.
                                            container_memory_statistics,
            cpu_statistics: engines_api_system.cpu_statistics,
            disk_statistics: engines_api_system.disk_statistics,
            network_statistics: engines_api_system.network_statistics,
          }
        end

        def container_memory_statistics
          engines_api_system.container_memory_statistics
        end

        ########################################################################
        # User management
        ########################################################################

        # def ldap
        #   @ldap ||= Services::Ldap.new( @settings )
        # end
        #
        # def kerberos_auth_service
        #   @kerberos_auth_service ||= Services::KerberosAuth.new(@settings)
        # end
        #
        # def kerberos_admin_service
        #   @kerberos_admin_service ||= Services::KerberosAdmin.new(@settings)
        # end
        #
        # def kerberos_auth(user_uid, password)
        #   kerberos_auth_service.auth(user_uid, password)
        # end
        #
        # def kerberos_principal(user_uid)
        #   kerberos_admin_service.get_principal(user_uid)
        # end

        ########################################################################
        # Users > accounts
        ########################################################################

        def index_users_accounts
          engines_api_system.index_users_accounts
        end

        def show_users_account( uid )
          engines_api_system.show_users_account( uid )
        end

        def create_users_account( account )
          engines_api_system.create_users_account( account )
        end

        def update_users_account( uid, account )
          engines_api_system.update_users_account( uid, account )
        end

        def delete_users_account( uid )
          engines_api_system.delete_users_account( uid )
        end

        ########################################################################
        # Users > accounts > groups
        ########################################################################

        def delete_users_account_groups( user_uid, names )
          engines_api_system.delete_users_account_groups( user_uid, names )
        end

        def new_users_account_groups( user_uid )
          engines_api_system.new_users_account_groups( user_uid )
        end

        def create_users_account_groups( user_uid, groups )
          groups = groups[:names].map { |name| { name: name } }
          engines_api_system.create_users_account_groups( user_uid, groups )
        end

        ########################################################################
        # Users > accounts > email
        ########################################################################

        def create_users_account_email( user_uid, email )
          engines_api_system.create_users_account_email( user_uid, email )
        end

        def edit_users_account_email( user_uid )
          engines_api_system.edit_users_account_email( user_uid )
        end

        def update_users_account_email( user_uid, email )
          engines_api_system.update_users_account_email( user_uid, email )
        end

        def delete_users_account_email( user_uid )
          engines_api_system.delete_users_account_email( user_uid )
        end

        ########################################################################
        # Users > accounts > password
        ########################################################################

        def update_users_account_password( user_uid, password )
          engines_api_system.update_users_account_password( user_uid, password )
        end



        #
        # def user_email(user_uid)
        #   ldap.user_email(user_uid)
        # end
        #
        # def user_setup_email( user_uid, email_domain )
        #   ldap.user_setup_email( user_uid, email_domain )
        # end
        #
        # def user_disable_email( user_uid )
        #   ldap.user_disable_email( user_uid )
        # end
        #
        # def user_edit_mailbox_domain( user_uid )
        #   ldap.user_edit_mailbox_domain( user_uid )
        # end
        #
        # def user_update_mailbox_domain( user_uid, email_domain )
        #   ldap.user_update_mailbox_domain( user_uid, email_domain )
        # end
        #
        # def user_new_add_email_address( user_uid )
        #   ldap.user_new_add_email_address( user_uid )
        # end
        #
        # def user_add_email_address( user_uid, email_address )
        #   ldap.user_add_email_address( user_uid, email_address )
        # end
        #
        # def user_new_remove_email_address( user_uid )
        #   ldap.user_email_addresses( user_uid )
        # end
        #
        # def user_remove_email_address( user_uid, email_address )
        #   ldap.user_remove_email_address( user_uid, email_address )
        # end
        #
        # def user_new_distribution_group( user_uid )
        #   ldap.user_new_distribution_group user_uid
        # end
        #
        # def user_create_distribution_group( user_uid, distribution_group )
        #   ldap.user_create_distribution_group( user_uid, distribution_group )
        # end
        #
        # def user_distribution_groups_remove(user_uid)
        #   ldap.user_distribution_groups_remove user_uid
        # end
        #
        #
        # def update_user(user_uid, data)
        #   ldap.update_user(user_uid, data)
        # end

        ########################################################################
        # User > groups
        ########################################################################

        def index_users_groups
          engines_api_system.index_users_groups
        end

        def show_users_group( name )
          engines_api_system.show_users_group( name )
        end

        #
        # def user_groups
        #   # engines_api_system.user_groups
        #   ldap.user_groups
        # end
        #
        # def user_group(user_group_name)
        #   ldap.user_group user_group_name
        # end

        ########################################################################
        # Email > distribution groups
        ########################################################################

        def index_email_distribution_groups
          engines_api_system.index_email_distribution_groups
        end

        def show_email_distribution_group( name )
          engines_api_system.show_email_distribution_group name
        end

        def new_email_distribution_group
          engines_api_system.new_email_distribution_group name
        end

        def create_email_distribution_group( distribution_group )
          engines_api_system.create_email_distribution_group distribution_group
        end

        def edit_email_distribution_group( name )
          engines_api_system.edit_email_distribution_group name
        end

        def update_email_distribution_group( name, distribution_group )
          engines_api_system.update_email_distribution_group name, distribution_group
        end

        def delete_email_distribution_group( name )
          engines_api_system.delete_email_distribution_group name
        end

        ########################################################################
        # Email > distribution groups > email addresses
        ########################################################################

        def new_email_distribution_group_email_address( distribution_group_name )
          engines_api_system.new_email_distribution_group_email_address distribution_group_name
        end

        def create_email_distribution_group_email_address( distribution_group_name, email_address )
          engines_api_system.create_email_distribution_group_email_address distribution_group_name, email_address
        end

        def delete_email_distribution_group_email_address( distribution_group_name, address )
          engines_api_system.delete_email_distribution_group_email_address distribution_group_name, address
        end



        #
        # def distribution_list( distribution_list_name )
        #   ldap.distribution_list( distribution_list_name )
        # end
        #
        # def distribution_lists_new
        #   ldap.distribution_lists_new
        # end
        #
        # def distribution_lists_create( data )
        #   ldap.distribution_lists_create( data )
        # end
        #
        # def distribution_list_edit( distribution_list_name )
        #   ldap.distribution_list_edit distribution_list_name
        # end
        #
        # def distribution_list_update( distribution_list_name, data )
        #   ldap.distribution_list_update distribution_list_name, data
        # end
        #
        # def distribution_list_delete( distribution_list_name )
        #   ldap.distribution_list_delete distribution_list_name
        # end
        #
        # def distribution_list_new_email_address( distribution_list_name )
        #   ldap.distribution_list_new_email_address( distribution_list_name )
        # end
        #
        # def distribution_list_create_email_address( distribution_list_name, email_addresses )
        #   ldap.distribution_list_create_email_address( distribution_list_name, email_addresses )
        # end
        #
        # def distribution_list_delete_email_address( distribution_list_name, email_addresses )
        #   ldap.distribution_list_delete_email_address( distribution_list_name, email_addresses )
        # end

        ########################################################################
        # Email
        ########################################################################

        def show_email
          engines_api_system.show_email
        end

        ########################################################################
        # Email > default domain
        ########################################################################

        def new_email_default_domain
          system_domains = domains
          {
            default: system_domains[:default],
            domains: system_domains[:names].map{ |domain| domain[:domain_name] }
          }
        end

        def update_email_default_domain( default_domain )
          engines_api_system.update_email_default_domain( default_domain )
        end

        def create_email_default_domain( default_domain )
          engines_api_system.create_email_default_domain( default_domain )
        end

        ########################################################################
        # Email > domains
        ########################################################################



        # def email_domains
        #   ldap.email_domains
        # end
        #
        # def email_domain(email_domain)
        #   ldap.email_domain(email_domain)
        # end
        #
        def new_email_domain
          system_domains = domains
          system_domain_names = system_domains[:names].map{ |domain| domain[:domain_name] }
          existing_domain_names = show_email[:domains]
          {
            domains: system_domain_names - existing_domain_names
          }
        end

        def create_email_domain( domain )
          engines_api_system.create_email_domain domain
        end

        def delete_email_domain( name )
          engines_api_system.delete_email_domain name
        end


        #
        # def deletable_email_domains
        #   existing_domains = email_domains
        #   if existing_domains[:domains].length < 2
        #     existing_domains[:domains]
        #   else
        #     existing_domains[:domains] - [ existing_domains[:default] ]
        #   end
        # end
        #
        # def delete_email_domain(email_domain)
        #   ldap.delete_email_domain email_domain
        # end
        #
        # def set_default_email_domain(data)
        #   ldap.set_default_email_domain data[:email_domain]
        # end
        #
        # def email_domains_create_setup(data)
        #   # service(:smtp).perform_configuration( :default_domain, domain_name: data[:email_domain] )
        #   # service(:email).perform_configuration( :default_domain, domain_name: data[:email_domain] )
        #
        #   ldap.create_email_domain data
        # rescue
        #   ldap.set_default_email_domain data[:email_domain]
        #   # service(:imap).instruct(:start)
        # end
        #





        ########################################################################
        # Email addresses
        ########################################################################

        def index_email_email_addresses
          engines_api_system.index_email_email_addresses
        end

        # def email_addresses
        #   ldap.email_addresses
        # end
        #
        # def email_address(email_address)
        #   ldap.email_address(email_address)
        # end
        #





        ########################################################################
        # Registry
        ########################################################################

        def registry
          {
            name: "Registry",
            content: "Engines system registry",
            children: [
              engines_api_system.registry_configurations,
              engines_api_system.registry_apps,
              engines_api_system.registry_services,
              engines_api_system.registry_orphans,
              engines_api_system.registry_shares,
            ]
          }
        end

        ########################################################################
        # Locale
        ########################################################################

        def locale
          engines_api_system.locale
        end

        def update_locale(data)
          engines_api_system.update_locale(
            { lang_code: data["lang_code"],
              country_code: data["country_code"] } )
        end

        ########################################################################
        # Timezone
        ########################################################################

        def timezone
          { timezone: engines_api_system.timezone }
        end

        def update_timezone(data)
          engines_api_system.update_timezone(
            { timezone: data["timezone"] } )
        end

        ########################################################################
        # Domains
        ########################################################################

        def domains
          all_domains = engines_api_system.domains.values.
                              sort_by { |domain| domain[:domain_name]  }
          {
            zeroconf: !all_domains.
                        find { |domain| domain[:domain_name] == "local" }.nil?,
            names: all_domains.
                        reject{ |domain| domain[:domain_name] == "local" },
            default: default_domain
          }
        end

        def default_domain
          engines_api_system.default_domain
        end

        def update_default_domain( data )
          engines_api_system.update_default_domain( data )
        end

        def create_domain( data )
          engines_api_system.create_domain( data )
        end

        def domain( domain_name)
          engines_api_system.domain( domain_name )
        end

        def update_domain( domain_name, data )
          engines_api_system.update_domain( domain_name, {
            self_hosted: ( data || {} )[:self_hosted] == '1',
            internal_only: ( data || {} )[:internal_only] == '1',
          } )
        end

        def delete_domain( domain_name)
          engines_api_system.delete_domain( domain_name )
          # return { message: "OK" } \
          #   if engines_api_system.delete_domain( domain_name ) == 'true'
          # raise NonFatalError.new "Failed to delete domain.", 405
        end

        def enable_zeroconf
          # return { message: "OK" } \
          #   if create_domain( { domain_name: :local, self_hosted: false, internal_only: false } ) == 'true'
          create_domain( { domain_name: :local, self_hosted: false, internal_only: false } )
        # rescue 405
        #   raise NonFatalError.new "Failed to enable Avahi (zeroconf).", 405
        end

        def disable_zeroconf
          delete_domain( :local )
        # rescue 405
        #   raise NonFatalError.new "Failed to disable Avahi (zeroconf).", 405
        end

        ########################################################################
        # Default site
        ########################################################################

        def default_site
          { default_site: engines_api_system.default_site }
        end

        def update_default_site( data )
          # return { message: "OK" } \
          #   if engines_api_system.update_default_site( data ) == 'true'
          # raise NonFatalError.new "Failed to update domain.", 405
          engines_api_system.update_default_site( data )
        end

        ########################################################################
        # Instructions
        ########################################################################

        def restart_base_os
          ## Give a response before shutting down.
          # Thread.new do
            # sleep 3
            engines_api_system.restart_base_os
          # end
          # return {}
        # rescue
          # return { message: "OK" } if engines_api_system.restart_base_os == 'true'
          # raise NonFatalError.new "Failed to reboot system.", 405
        end

        def restart_engines
          engines_api_system.restart_engines
          # return { message: "OK" } if engines_api_system.restart_engines == 'true'
          # raise NonFatalError.new "Failed to restart Engines.", 405
        end

        def update_engines
          engines_api_system.update_engines
          # return { message: "OK" } if engines_api_system.update_engines == 'true'
          # raise NonFatalError.new "Engines is already up to date.", 405
        end

        def update_base_os
          engines_api_system.update_base_os
          # return { message: "OK" } if engines_api_system.update_base_os == 'true'
          # raise NonFatalError.new "Base OS is already up to date.", 405
        end

        ########################################################################
        # SSH keys
        ########################################################################

        def public_ssh_key
          engines_api_system.public_ssh_key
        end


        def update_public_ssh_key( data )
          key = Base64.encode64 data[:key_file][:tempfile].read
          engines_api_system.update_public_ssh_key( { public_key: key } )
        end

        def private_ssh_key
          engines_api_system.private_ssh_key
        end

        ########################################################################
        # Certificates
        ########################################################################

        def certificates
          engines_api_system.certificates
        end

        def certificate( certificate_path )
          engines_api_system.certificate certificate_path # certificate_id.gsub( "|", "/" )
        end

        def create_certificate( data )
          api_args = {
            certificate: data[:certificate_file][:tempfile],
            domain_name: "",
            set_as_default: true
          }
          if data[:for] == "default"
            engines_api_system.create_default_certificate( api_args )
          else
            data[:target] = nil if data[:for] == :unassigned
            engines_api_system.create_service_certificate( api_args )
          end
          # key = Base64.encode64 data[:key_file][:tempfile].read
        end

        def delete_certificate( certificate_path )
          engines_api_system.delete_certificate certificate_path # certificate_id.gsub( "|", "/" )
        end

        def certificate_authority
          engines_api_system.certificate_authority
        end

        def service_certificates
          engines_api_system.service_certificates
        end

        def update_service_certificate( data )
          cert_data = data[:certificate].split('|')
          store_path = cert_data[0]
          cert_name = cert_data[1]
          engines_api_system.update_service_certificate(
            service_name: data[:service_name],
            store_path: store_path,
            cert_name: cert_name )
        end

        ########################################################################
        # Events
        ########################################################################

        def container_event_stream( &block )
          engines_api_system.container_event_stream do |event_json|
            begin
              event = JSON.parse(event_json, symbolize_names: true)
#
# puts "Processing event: #{event}"
# puts "Event state: #{event[:state]}"
#
              if event[:container_name].nil?
                yield ( {type: :heartbeat} )
              else
                # sleep 5
                container_name = event[:container_name]
                case event[:container_type].to_sym
                when :container, :application, :app ## James needs to standardize this
                  container_type = :app
                  status = app_status_for container_name
                when :service
                  container_type = :service
                  status = service_status_for container_name
                end

# begin
#   if status
#     puts "AFTER EVENT container[:status][:state] #{status[:state]}"
#   else
#     puts "AFTER EVENT no container[:status]"
#   end
# rescue => e
# puts '[------------------------------------------------------'
# puts "Event error"
# puts :event
# puts event
# puts :status
# puts status
# puts :error
# puts e
# puts ']------------------------------------------------------'
# end
                if status
                  yield ( { type: :container_status,
                            container_type: container_type,
                            container_name: container_name,
                            status: status.merge( { name: container_name } ) } )
                end
              end
            # rescue JSON::ParserError
            #   yield( {type: :heartbeat} )
            end
          end
        end

        def app_status_for(container_name)

          app(container_name).container[:status]
        end

        def service_status_for(container_name)
          service(container_name).container[:status]
        end

        # def escape(string)
        #   if string.respond_to?(:force_encoding)
        #     string = string.encode(::Encoding::UTF_8, :undef => :replace).
        #                     force_encoding(::Encoding::BINARY)
        #   end
        #   json = string.
        #     gsub(escape_regex) { |s| ESCAPED_CHARS[s] }.
        #     gsub(/([\xC0-\xDF][\x80-\xBF]|
        #            [\xE0-\xEF][\x80-\xBF]{2}|
        #            [\xF0-\xF7][\x80-\xBF]{3})+/nx) { |s|
        #     s.unpack("U*").pack("n*").unpack("H*")[0].gsub(/.{4}/n, '\\\\u\&')
        #   }
        #   json = %("#{json}")
        #   json.force_encoding(::Encoding::UTF_8) \
        #           if json.respond_to?(:force_encoding)
        #   json
        # end

        def builder_log_event_stream(&block)
          engines_api_system.builder_log_event_stream do |event|
            begin
              puts "event: #{event}"
              puts "event: #{event.force_encoding("UTF-8")}"
              puts "event in hash: #{ { event: event.force_encoding("UTF-8") } }"
              puts "event in hash to_json: #{ { event: event.force_encoding("UTF-8") }.to_json }"
              yield ( { type: :line, line: event.force_encoding("UTF-8") } )
            rescue => e
              puts "event error: #{e}"
            end
          end
          yield ( { type: :eof } )
        end

        ########################################################################
        # Services
        ########################################################################

        def service_definition_for( publisher_namespace, type_path )
          engines_api_system.service_definition_for(
            publisher_namespace: publisher_namespace,
            type_path: type_path )
        end

        def shareable_service_consumers_for( publisher_namespace, type_path )
          engines_api_system.shareable_service_consumers_for(
            publisher_namespace: publisher_namespace,
            type_path: type_path ).map do |service_consumer|
            {
              parent: service_consumer[:parent_engine],
              service_handle: service_consumer[:service_handle],
              variables: service_consumer[:variables],
            }
          end
        end

        def adoptable_service_consumers_for( publisher_namespace, type_path )
          engines_api_system.adoptable_service_consumers_for(
            publisher_namespace: publisher_namespace,
            type_path: type_path ).map do |service_consumer|
            {
              parent: service_consumer[:parent_engine],
              service_handle: service_consumer[:service_handle],
              variables: service_consumer[:variables],
            }
          end
        end

        # def existing_services_for( publisher_namespace, type_path )
        #   @existing_services_collection ||=
        #   engines_system.persistent_service_connections_for(publisher_type_path).map do |service_consumer|
        #     [ "#{service_consumer[:parent_engine]}##{service_consumer[:service_handle]}",
        #     (service_consumer[:parent_engine] +
        #     ( service_consumer[:parent_engine] ==
        #                 service_consumer[:service_handle] ?
        #                 '' : " - (#{service_consumer[:service_handle]})" ) ) ]
        #   end
        # end
        #
        # def orphan_services_for( publisher_namespace, type_path )
        #   @orphan_services_collection ||=
        #   engines_system.orphan_service_connections_for(publisher_type_path).map do |service_consumer|
        #     ["#{service_consumer[:parent_engine]}##{service_consumer[:service_handle]}",
        #     (service_consumer[:parent_engine] +
        #     ( service_consumer[:parent_engine] ==
        #                 service_consumer[:service_handle] ?
        #                 '' : " - (#{service_consumer[:service_handle]})" ) ) ]
        #   end
        # end

        ########################################################################
        # Orphan data
        ########################################################################

        def orphan_data
          return [] if engines_api_system.orphan_data[:children].empty?
          listTreeNodesContent( engines_api_system.orphan_data ).map do |orphan|
            service_definition = service_definition_for( orphan[:publisher_namespace], orphan[:type_path] )
            {
              type: "#{service_definition[:author]} #{service_definition[:title]}",
              publisher_namespace: orphan[:publisher_namespace],
              type_path: orphan[:type_path],
              parent: orphan[:parent_engine],
              service_handle: orphan[:service_handle]
            }
          end.sort_by { |orphan| orphan[:parent] + orphan[:service_handle] }
        end

        def listTreeNodesContent(node)
          if node[:children].any?
            [].tap do |result|
              node[:children].each do |child_node|
                result << listTreeNodesContent(child_node)
              end
            end.flatten
          else
            node[:content]
          end
        end

        def delete_orphan(orphan_id)
          engines_api_system.delete_orphan_data( orphan_id.gsub( "|", "/" ) )
        end

        ########################################################################
        # Install
        ########################################################################

        def install(data)
          install_params = install_params_for(data)
          engines_api_system.install(install_params)
          # return { message: "OK" } if engines_api_system.install(install_params) == 'true'
          # raise NonFatalError.new "Failed to install.", 405
        end

        def install_params_for(data)
          {
            engine_name: data[:engine_name],
            host_name: data[:host_name],
            domain_name: data[:domain_name],
            http_protocol: data[:http_protocol],
            memory: data[:memory],
            country_code: data[:country_code],
            lang_code: data[:language_code],
            variables: data[:environment_variables],
            attached_services: ( data[:services] || [] ).map do |service|
              if service[:create_type] == "share"
                create_type = "existing"
                parent_engine, service_handle = *service[:share].split("#")
              elsif service[:create_type] == "adopt"
                create_type = "orphan"
                parent_engine, service_handle = *service[:adopt].split("#")
              else
                create_type = "new"
              end
              {
                publisher_namespace: service[:publisher_namespace],
                type_path: service[:type_path],
                create_type: create_type,
                parent_engine: parent_engine,
                service_handle: service_handle
              }
            end,
            repository_url: data[:blueprint_url],
            icon_url: data[:icon_url],
          }
        end

        def current_build
          engines_api_system.current_build.tap do |result|
            if result[:variables]
              result[:variables] = result[:variables].map do |k,v|
                k[-8..-1] == "password" ? { k => "********" } : { k => v }
              end.inject :merge
            end
          end
        end

        def last_install
          {
            params: engines_api_system.last_build_params,
            log: engines_api_system.last_build_log,
          }
        end

        ######################################################################
        # Exception logging
        ######################################################################

        def report_exceptions
          engines_api_system.report_exceptions
        end

        def enable_exception_reporting

          engines_api_system.enable_exception_reporting
        end

        def disable_exception_reporting

          engines_api_system.disable_exception_reporting
        end


        ########################################################################
        # Shutdown
        ########################################################################

        def shutdown(data)
          # return {}
          engines_api_system.shutdown( { reason: data[:reason] } )

          # return { message: "OK" } if engines_api_system.shutdown( { reason: data[:reason] } ) == 'true'
          # raise NonFatalError.new "Failed to shutdown system.", 405
        end

      end
    end
  end
end
