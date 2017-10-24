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

        def post(route, params={})
          handle_response do
            RestClient::Request.execute(
              method: :post,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: params }.to_json,
              contentType: 'application/json',
              timeout: 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def put_stream(route, params={})
          handle_response do
            RestClient::Request.execute(
              method: :put,
              url: "#{@url}/v0/#{route}",
              payload: { api_vars: params }.to_json,
              contentType: 'application/octet-stream',
              timeout: 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def get(route)
          handle_response do
            RestClient::Request.execute(
              method: :get,
              url: "#{@url}/v0/#{route}",
              timeout: 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def delete(route)
          handle_response do
            RestClient::Request.execute(
              method: :delete,
              url: "#{@url}/v0/#{route}",
              timeout: 120,
              verify_ssl: false,
              headers: {
                access_token: @token
              }
            )
          end
        end

        def handle_response
          response = yield
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
        rescue RestClient::Forbidden
          raise NonFatalError.new 'Not signed in.', 401
        # rescue RestClient::NotFound => e
          # message = JSON.parse(e.response.net_http_res.body, symbolize_names: true )[:error_object][:error_mesg]
          # raise NonFatalError.new "#{message}", 500
          # raise e

        rescue RestClient::MethodNotAllowed
          raise NonFatalError.new 'Not allowed.', 405
        rescue Errno::ECONNREFUSED, Errno::ECONNRESET, RestClient::ServerBrokeConnection, OpenSSL::SSL::SSLError
          raise NonFatalError.new "System busy.", 503
        # rescue => e
        #   # raise NonFatalError.new "Unhandled Engines API error.", 500
        #   raise e
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
                response.read_body do |event|
                  yield event
                end
              end
            rescue EOFError
              return
            end
          end
        end

      end
    end
  end
end
