class V0
  module Api
    module Models
      class System

        def initialize(ip_address, settings, token=nil)
          @ip_address = ip_address
          @token = token
          @settings = settings
        end
        attr_reader :ip_address, :api

        def system_api_url
          "https://#{@ip_address}:2380"
        end

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
          @engines_api ||= Services::EnginesApi.new( system_api_url, @token, @settings )
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
            ip_address: ip_address,
            status: status,
            report_exceptions: report_exceptions,
            properties: {
              label: label,
              version: {
                engines: engines_api_system.engines_version,
                base_os: engines_api_system.base_os_version
              },
            },
            builder: {
              status: engines_api_system.builder_status,
              current: current_build
            },
          }
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
        # Sysadmin user
        ########################################################################

        def system_user
          engines_api_system.system_user
        end

        def update_system_user_password(data)
          engines_api_system.update_system_user_password( data )
        end

        def update_system_user_email(data)
          engines_api_system.update_system_user_email( data )
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

        def reinstate
          engines_api_system.reinstate
        end

        ########################################################################
        # Reserved names
        ########################################################################

        def reserved_names
          {
            reserved_fqdns: reserved_fqdns,
            reserved_container_names: reserved_container_names,
          }
        end

        def reserved_container_names
          engines_api_system.reserved_container_names
        end

        def reserved_fqdns
          engines_api_system.reserved_fqdns
        end

        ########################################################################
        # Statistics
        ########################################################################

        def summary_statistics
          engines_api_system.summary_statistics
        end

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

        def delete_users_account_groups( user_uid, group_dns )
          return unless group_dns
          engines_api_system.delete_users_account_groups( user_uid, group_dns )
        end

        def new_users_account_groups( user_uid )
          engines_api_system.new_users_account_groups( user_uid )
        end

        def create_users_account_groups( user_uid, groups )
          return unless groups
          # groups = groups[:names].map { |name| { name: name } }
          engines_api_system.create_users_account_groups( user_uid, groups[:dns] )
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
        # Users > accounts > email > distribution groups
        ########################################################################

        def new_users_account_email_distribution_group( user_uid )
          engines_api_system.new_users_account_email_distribution_group( user_uid )
        end

        def create_users_account_email_distribution_group( user_uid, distribution_group )
          engines_api_system.create_users_account_email_distribution_group( user_uid, distribution_group )
        end

        ########################################################################
        # Users > accounts > email > aliases
        ########################################################################

        def create_users_email_alias( user_uid, _alias )
          engines_api_system.create_users_email_alias( user_uid,
          { address: "#{_alias[:local_part]}@#{_alias[:domain]}" } )
        end

        def delete_users_email_alias( user_uid, address )
          engines_api_system.delete_users_email_alias( user_uid, address )
        end

        ########################################################################
        # Users > accounts > password
        ########################################################################

        def update_users_account_password( user_uid, password )
          engines_api_system.update_users_account_password( user_uid, password )
        end

        ########################################################################
        # User > groups
        ########################################################################

        def index_users_groups
          engines_api_system.index_users_groups
        end

        def show_users_group( group_dn )
          engines_api_system.show_users_group( group_dn )
        end

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

        ########################################################################
        # Email addresses
        ########################################################################

        def index_email_email_addresses
          engines_api_system.index_email_email_addresses
        end

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
              engines_api_system.registry_subservices,
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
        end

        def enable_zeroconf
          create_domain( { domain_name: :local, self_hosted: false, internal_only: false } )
        end

        def disable_zeroconf
          delete_domain( :local )
        end

        ########################################################################
        # Default site
        ########################################################################

        def default_site
          { default_site: engines_api_system.default_site }
        end

        def update_default_site( data )
          engines_api_system.update_default_site( data )
        end

        ########################################################################
        # Dashboard label
        ########################################################################

        def label
          engines_api_system.system_user_settings[:label] || {}
        end

        def update_label( data )
          engines_api_system.update_system_user_settings(
            engines_api_system.system_user_settings.merge( { label: data } )
          )
        end

        ########################################################################
        # Instructions
        ########################################################################

        def restart_base_os
          Thread.new do
            sleep 1
            engines_api_system.restart_base_os
          end
          return {}
        end

        def restart_engines
          engines_api_system.restart_engines
        end

        def update_engines
          engines_api_system.update_engines
        end

        def update_base_os
          engines_api_system.update_base_os
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

        def repo_keys
          engines_api_system.repo_keys[:repo_key_names]
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
        end

        def delete_certificate( certificate_path )
          engines_api_system.delete_certificate certificate_path # certificate_id.gsub( "|", "/" )
        end

        def certificate_authority
          engines_api_system.certificate_authority
        end

        def service_certificates
          engines_api_system.service_certificates.
            sort_by{|service_certificate| service_certificate[:name]}
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
              if event[:container_name].nil?
                yield ( {type: :heartbeat} )
              else
                container_name = event[:container_name]
                case event[:container_type].to_sym
                when :container, :application, :app ## James needs to standardize this
                  container_type = :app
                  status = app_status_for container_name
                when :service
                  container_type = :service
                  status = service_status_for container_name
                end
                if status
                  yield ( { type: :container_status,
                            container_type: container_type,
                            container_name: container_name,
                            status: status.merge( { name: container_name } ) } )
                end
              end
            end
          end
        end

        def app_status_for(container_name)
          app(container_name).container[:status]
        end

        def service_status_for(container_name)
          service(container_name).container[:status]
        end

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

        ########################################################################
        # Orphan data
        ########################################################################

        def orphan_data
          return [] if engines_api_system.orphan_data[:children].empty?
          listTreeNodesContent( engines_api_system.orphan_data ).map do |orphan|
            # service_definition = service_definition_for( orphan[:publisher_namespace], orphan[:type_path] )
            {
              service_name: orphan[:service_container_name],
              # title: "#{service_definition[:title] || "SERVICE DEFINITON IS MISSING VALUE FOR `TITLE`"}",
              publisher_namespace: orphan[:publisher_namespace],
              type_path: orphan[:type_path],
              parent: orphan[:parent_engine],
              service_handle: orphan[:service_handle],
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
            permission_as: data[:permission_as],
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
            installed_packages: data[:installed_packages],
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
          engines_api_system.shutdown( { reason: data[:reason] } )
        end

      end
    end
  end
end
