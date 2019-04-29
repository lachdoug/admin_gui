class V0
  module Api
    module Models
      class System
        class NewApp

          def initialize(system, blueprint_url)
            @blueprint_url = blueprint_url
            @system = system
          end

          def to_h
            {
              blueprint_url: @blueprint_url,
              blueprint: blueprint,
              consumable_services: consumable_services,
              locale: @system.locale,
              domains: domains,
              installed_apps: @system.app_statuses.map{ |app| app[:name] },
              default_domain: @system.default_domain,
              reserved: {
                container_names: @system.reserved_container_names,
                fqdns: @system.reserved_fqdns
              }
            }
          end

          def blueprint
            @blueprint ||= @system.engines_api.system.resolve_blueprint( @blueprint_url )
            # handle_response do
            #   RestClient::Request.execute( method: :get, url: "#{@blueprint_url}", timeout: 120, verify_ssl: false )
            # end
          end

          # def handle_response
          #   JSON.parse yield.body, symbolize_names: true
          # rescue JSON::ParserError
          #
          #   raise NonFatalError.new "Invalid blueprint.", 405
          # rescue RestClient::NotFound
          #   raise NonFatalError.new "Could not find blueprint.", 405
          # end

          def consumable_services
            ( blueprint.dig(:software, :service_configurations) || [] ).
            map do |service_configuration|
              {
                service_definition: @system.service_definition_for(
                  service_configuration[:publisher_namespace],
                  service_configuration[:type_path] ),
                shareable: @system.shareable_service_consumers_for(
                  service_configuration[:publisher_namespace],
                  service_configuration[:type_path] ),
                adoptable: @system.adoptable_service_consumers_for(
                  service_configuration[:publisher_namespace],
                  service_configuration[:type_path] )
              }
            end
          end

          def domains
            @system.domains[:names].map do |domain_name|
              domain_name[:domain_name]
            end + ( @system.domains[:zeroconf] ? [ "local" ] : [] )
          end

        end
      end
    end
  end
end
