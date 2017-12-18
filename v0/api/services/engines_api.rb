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

        def post(route, params={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :post,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: ( params || {} ) }.to_json,
              contentType: 'application/json',
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def put_stream(route, params={}, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :put,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: ( params || {} ) }.to_json,
              contentType: 'application/octet-stream',
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def get(route, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :get,
              url: "#{@url}/v0/#{route}",
              timeout: opts[:timeout] || 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def delete(route, opts={})
          handle_response do
            RestClient::Request.execute(
              method: :delete,
              url: "#{@url}/v0/#{route}",
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
          puts '================='
          puts yield
          puts '================='
          return nil unless response.headers[:content_type]
          case response.headers[:content_type].split(';').first
          when 'application/json'
            JSON.parse response.body, symbolize_names: true
          when 'text/plain'
            response.body
          when 'application/octet-stream'
            response.body
          else
            raise StandardError.new 'An unhandled content type was returned by the system API.'
          end
        rescue => e
          puts '---------------'
          puts e
          puts '---------------'
          raise e
        rescue RestClient::Forbidden
          raise NonFatalError.new 'Not signed in.', 401
        rescue RestClient::MethodNotAllowed => e
          system_error_message = JSON.parse(e.response.body, symbolize_names: true)[:error_object][:error_mesg]
          raise NonFatalError.new "Not allowed.\n\nReason: #{system_error_message}", 405
        rescue Errno::ENETUNREACH => e
          raise NonFatalError.new "Admin GUI server is not connected to the network.\n\nReason: #{e.message}\n\nThe connection will be tried again in a moment.", 503
        rescue  Errno::EHOSTUNREACH,
                Errno::ECONNREFUSED,
                Errno::ECONNRESET,
                RestClient::ServerBrokeConnection,
                OpenSSL::SSL::SSLError,
                RestClient::Exceptions::OpenTimeout => e
                # byebug
          raise NonFatalError.new "The system is unavailable.\n\nReason: #{e.message}\n\nThis usually temporary and happens when the system is busy or restarting.\n\nPlease wait a moment.", 503
        end

        # read stream

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
          puts "Event stream closed with error #{e}"
        end

      end
    end
  end
end
