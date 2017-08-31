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
              domains: @system.domains.values,
              default_domain: @system.default_domain,
              reserved: {
                container_names: @system.reserved_container_names,
                fqdns: @system.reserved_fqdns
              }
            }
          end

          def blueprint
            @blueprint ||= handle_response do
              RestClient::Request.execute(
                method: :get,
                url: "#{@blueprint_url}",
                timeout: 120,
                verify_ssl: false,
              )
            end
          end

          def handle_response
            JSON.parse yield.body, symbolize_names: true
          rescue JSON::ParserError
            byebug
            raise NonFatalError.new "Invalid blueprint.", 405
          end

          def consumable_services
            ( blueprint.dig(:software, :service_configurations) || [] ).
            map do |service_configuration|
              definition_path = service_configuration[:publisher_namespace] + "/" + service_configuration[:type_path]
              {
                service_definition: @system.service_definition_for(definition_path),
                sharable: @system.shareable_service_consumers_for(definition_path),
                adoptable: @system.adoptable_service_consumers_for(definition_path)
              }
            end
          end

        end
      end
    end
  end
end
