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

        def to_json
          to_h.to_json
        end

        def to_h
          # byebug

          raise ( NonFatalError.new "Engines update in progress. The update process normally takes a minute or two, but can take longer in some cases.", 503 ) \
            if status[:is_engines_system_updating]
          raise ( NonFatalError.new "Base OS update in progress. The update process normally takes a minute or two, but can take longer in some cases.", 503 ) \
            if status[:is_base_system_updating]
          raise ( NonFatalError.new "Reboot in progress.", 503 ) \
            if status[:is_rebooting]

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
            apps: app_statuses,
            services: service_statuses
          }

        rescue => e
          raise NonFatalError.new "System busy.", 503 if e.status_code == 405
          raise e
        end

        ########################################################################
        # Auth
        ########################################################################

        def sign_in(params)
          engines_api_system.sign_in params
        rescue NonFatalError
          raise NonFatalError.new "Invalid password.", 401
        end

        def sign_out
          engines_api_system.sign_out
        end

        ########################################################################
        # Admin user
        ########################################################################

        def update_admin_user(form_data)
          engines_api_system.update_admin_user( form_data )
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

        def app_statuses
          engines_api_system.app_statuses.sort.map do |k,v|
            { name: k }.merge v
          end
        end

        def service_statuses
          engines_api_system.service_statuses.sort.map do |k,v|
            { name: k }.merge v
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

        def update_locale(form_data)
          engines_api_system.update_locale(
            { lang_code: form_data["lang_code"],
              country_code: form_data["country_code"] } )
        end

        ########################################################################
        # Timezone
        ########################################################################

        def timezone
          { timezone: engines_api_system.timezone }
        end

        def update_timezone(form_data)
          engines_api_system.update_timezone(
            { timezone: form_data["timezone"] } )
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

        def update_default_domain( form_data )
          engines_api_system.update_default_domain( form_data )
        end

        def create_domain( form_data )
          engines_api_system.create_domain( form_data )
        end

        def domain( domain_name)
          engines_api_system.domain( domain_name )
        end

        def update_domain( domain_name, form_data )
          engines_api_system.update_domain( domain_name, form_data )
        end

        def delete_domain( domain_name)
          return { message: "OK" } \
            if engines_api_system.delete_domain( domain_name ) == 'true'
          raise NonFatalError.new "Failed to delete domain.", 405
        end

        def enable_zeroconf
          return { message: "OK" } \
            if create_domain( { domain_name: :local, self_hosted: false, internal_only: false } ) == 'true'
          raise NonFatalError.new "Failed to enable Avahi (zeroconf).", 405
        end

        def disable_zeroconf
          delete_domain( :local )
        rescue 405
          raise NonFatalError.new "Failed to disable Avahi (zeroconf).", 405
        end

        ########################################################################
        # Default site
        ########################################################################

        def default_site
          { default_site: engines_api_system.default_site }
        end

        def update_default_site( form_data )
          return { message: "OK" } \
            if engines_api_system.update_default_site( form_data ) == 'true'
          raise NonFatalError.new "Failed to update domain.", 405
        end

        ########################################################################
        # Instructions
        ########################################################################

        def restart_base_os
          return { message: "OK" } if engines_api_system.restart_base_os == 'true'
          raise NonFatalError.new "Failed to reboot system.", 405
        end

        def restart_engines
          return { message: "OK" } if engines_api_system.restart_engines == 'true'
          raise NonFatalError.new "Failed to restart Engines.", 405
        end

        def update_engines
          return { message: "OK" } if engines_api_system.update_engines == 'true'
          raise NonFatalError.new "Engines is already up to date.", 405
        end

        def update_base_os
          return { message: "OK" } if engines_api_system.update_base_os == 'true'
          raise NonFatalError.new "Base OS is already up to date.", 405
        end

        ########################################################################
        # SSH keys
        ########################################################################

        def public_ssh_key
          engines_api_system.public_ssh_key
        end


        def update_public_ssh_key( form_data )
          key = Base64.encode64 form_data[:key_file][:tempfile].read
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

        def create_certificate( form_data )
          api_args = {
            certificate: form_data[:certificate_file][:tempfile],
            domain_name: "",
            set_as_default: true
          }
          if form_data[:for] == "default"
            engines_api_system.create_default_certificate( api_args )
          else
            form_data[:target] = nil if form_data[:for] == :unassigned
            engines_api_system.create_service_certificate( api_args )
          end
          # key = Base64.encode64 form_data[:key_file][:tempfile].read
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

        def update_service_certificate( service_certificate_id )
          engines_api_system.
            update_service_certificate service_certificate_id.gsub( "|", "/" )
        end

        ########################################################################
        # Events
        ########################################################################

        def container_event_stream( &block )
          engines_api_system.container_event_stream do |event_json|
            begin
              # p "event: #{event}"
              event = JSON.parse(event_json, symbolize_names: true)
              # p "event: #{event}"
              if event[:container_name].nil?
                yield ( {type: :heartbeat} )
              # elsif event[:state] == "oom"
              #   yield ( { type: :container_oom,
              #             name: event[:container_name] } )
              else
p :event
p event
                container_name = event[:container_name]
p :app_status_from_app_statuses
p engines_api_system.app_statuses[container_name.to_sym]
                case event[:container_type].to_sym
                when :container, :application ## James needs to standardize this
                  container_type = :app
                  status = app_status_for container_name
                when :service
                  container_type = :service
                  status = service_status_for container_name
                end
                yield ( { type: :container_status,
                          container_type: container_type,
                          container_name: container_name,
                          status: status.merge( { name: container_name } ) } )
              end
            rescue JSON::ParserError
              yield( {type: :heartbeat} )
            end
          end
        end

        def app_status_for(container_name)
          # byebug
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
            # rescue => e
            #   byebug
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

        def install(form_data)
          install_params = install_params_for(form_data)
          return { message: "OK" } if engines_api_system.install(install_params) == 'true'
          raise NonFatalError.new "Failed to install.", 405
        end

        def install_params_for(form_data)
          {
            engine_name: form_data[:engine_name],
            host_name: form_data[:host_name],
            domain_name: form_data[:domain_name],
            http_protocol: form_data[:http_protocol],
            memory: form_data[:memory],
            country_code: form_data[:country_code],
            lang_code: form_data[:language_code],
            variables: form_data[:environment_variables],
            attached_services: form_data[:services].map do |service|
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
            repository_url: form_data[:blueprint_url]
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
          # byebug
          engines_api_system.enable_exception_reporting
        end

        def disable_exception_reporting
          # byebug
          engines_api_system.disable_exception_reporting
        end


        ########################################################################
        # Shutdown
        ########################################################################

        def shutdown(form_data)
          # byebug
          return { message: "OK" } if engines_api_system.shutdown( { reason: form_data[:reason] } ) == 'true'
          raise NonFatalError.new "Failed to shutdown system.", 405
        end

      end
    end
  end
end
