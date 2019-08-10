class V0
  module Api
    module Helpers

      def handle_response
        response = yield
        return nil unless response.headers[:content_type]
        case response.headers[:content_type].split(";").first
        when 'application/json'
          JSON.parse response.body, symbolize_names: true
        when 'text/plain'
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
        raise NonFatalError.new "The system is unavailable.\n\nReason: #{e.message}\n\nThis is usually temporary and happens when the system is busy or restarting.\n\nPlease wait a moment.", 502
      end

    end
  end
end
