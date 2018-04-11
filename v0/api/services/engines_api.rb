class V0
  module Api
    module Services
      class EnginesApi

        def initialize(url, token, settings)
          @url = url
          @token = token
          @settings = settings
        end
        attr_reader :url

        def system
          System.new self
        end

        def app(name)
          App.new self, name
        end

        def service(name)
          Service.new self, name
        end

        def post(route, data={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :post,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: ( data || {} ) }.to_json,
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                content_type: :json,
                access_token: @token
              }
            )
          end
        end

        def put(route, data={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :put,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: ( data || {} ) }.to_json,
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                content_type: :json,
                access_token: @token
              }
            )
          end
        end

        def put_stream(route, data={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :put,
              url: "#{@url}/v0/#{route}",
              payload: data,
              contentType: 'application/octet-stream',
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def get(route, data={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :get,
              url: "#{ @url }/v0/#{ route }?#{ URI.encode_www_form data }",
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def delete(route, data={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :delete,
              url: "#{@url}/v0/#{route}", #{}"?#{ URI.encode_www_form data }",
              payload: { api_vars: ( data || {} ) }.to_json,
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def handle_response
          response = yield
          return nil unless response.headers[:content_type]
          case response.headers[:content_type].split(";").first
          when 'application/json'
            JSON.parse response.body, symbolize_names: true
          when 'text/plain'
            response.body
          when 'application/octet-stream'
            response.body
          else
            raise StandardError.new "An unhandled content type was returned by the system API. (#{response.headers[:content_type]})"
          end
        rescue RestClient::Forbidden
          raise NonFatalError.new 'Not signed in.', 401
        rescue RestClient::MethodNotAllowed => e
          response = JSON.parse(e.response.body, symbolize_names: true)
          error = response[:error_object] || response[:error]
          system_error_message = error[:error_mesg] || error[:message]
          raise NonFatalError.new "Warning\n\n#{system_error_message}", 405
        rescue Errno::ENETUNREACH => e
          raise NonFatalError.new "Admin GUI server is not connected to the network.\n\nReason: #{e.message}\n\nThe connection will be tried again in a moment.", 502
        rescue  Errno::EHOSTUNREACH,
                Errno::ECONNREFUSED,
                Errno::ECONNRESET,
                OpenSSL::SSL::SSLError,
                RestClient::ServerBrokeConnection,
                RestClient::Exceptions::OpenTimeout,
                RestClient::Exceptions::ReadTimeout => e
          raise NonFatalError.new "The system is unavailable.\n\nReason: #{e.message}\n\nThis usually temporary and happens when the system is busy or restarting.\n\nPlease wait a moment.", 502
        end

        def stream(route)
          uri = URI @url
          net_http = Net::HTTP.new(uri.host,uri.port)
          net_http.use_ssl = (uri.scheme == 'https')
          net_http.verify_mode = OpenSSL::SSL::VERIFY_NONE
          net_http.start do |http|
            begin
              request = Net::HTTP::Get.new URI("#{@url}/v0/#{route}")
              request['access_token'] = @token
              http.request(request) do |response|
                # puts "response #{response}"
                response.read_body do |event|
                  # puts "event #{event}"
                  yield event
                end
              end
            end
          end
        rescue => e
          puts "Stream closed with error #{e}"
        end

      end
    end
  end
end
