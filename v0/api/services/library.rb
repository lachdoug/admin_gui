class V0
  module Api
    module Services
      class Library

        def initialize(settings)
          @url = settings.library_url
          @data_file_path = settings.data_directory_path + "/library.json"
          FileUtils.touch @data_file_path
        end
        # attr_reader :url

        def to_h
          @to_h ||= app_data
        end

        def update_data_file

          File.write @data_file_path, {
            timestamp: Time.now.to_i,
            library_apps: remote_data
          }.to_json
        end

        def remote_data
          @remote_data ||= handle_response do
            RestClient::Request.execute(
              method: :get,
              url: "#{@url}",
              timeout: 120,
              verify_ssl: false,
            )
          end
        rescue
          raise NonFatalError.new "Failed to load list of apps from #{@url}.", 405
        end

        def handle_response
          JSON.parse yield.body, symbolize_names: true
        end

        def app_data
          if ( cached_data[:timestamp].to_i + 3600 ) < Time.now.to_i
            update_data_file
            remote_data
          else
            cached_data[:library_apps]
          end
        end

        def cached_data
          @cached_data ||=
          begin
            JSON.parse File.read(@data_file_path), symbolize_names: true
          rescue JSON::ParserError
            {}
          end
        end

      end
    end
  end
end
