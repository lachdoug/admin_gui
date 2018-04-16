class V0
  module Api
    module Models
      class User

        attr_reader :username

        def initialize( session, request, settings )
          @session = session
          @ip_address = request.ip
          @settings = settings
          FileUtils.touch "#{@settings.data_directory_path}/current_user.json"
        end

        def sign_in( system, data )
          api_token = system.sign_in( { password: data[:password], ip_address: @ip_address } )
          save_current_user api_token
        end

        def sign_out
          save_current_user(nil)
        end

        def authenticated?(opts={})
          ( session_id == stored_session_id ) &&
          check_timeout_and_ip( opts )
        end

        def system_api_token
          current_user_tokens[:system_api_token]
        end

        def signin_timeout?
          ( Time.now.to_i - current_user_tokens[:timestamp].to_i ) > @settings.user_inactivity_timeout
        end

        def not_from_original_ip_address?
          @ip_address != current_user_tokens[:ip_address]
        end

        private

        def session_id
          @session[:tracking]["HTTP_USER_AGENT"]
        end

        def save_current_user(new_system_api_token)
          File.write "#{@settings.data_directory_path}/current_user.json",
           new_system_api_token ? {
             system_api_token: new_system_api_token,
             session_id: session_id,
             timestamp: Time.now.to_i,
             ip_address: @ip_address
           }.to_json : ""
        end

        def current_user_tokens
          @current_user_tokens ||=
          begin
            current_user_tokens_file = File.read "#{@settings.data_directory_path}/current_user.json"
            JSON.parse ( current_user_tokens_file ), symbolize_names: true
          rescue
            {}
          end
        end

        def stored_session_id
          current_user_tokens[:session_id]
        end

        def check_timeout_and_ip( opts )
          force_sign_out "Signed out due to inactivity." if signin_timeout?
          force_sign_out "Signed out due to sign in from another IP address." if not_from_original_ip_address?
          refresh_timestamp_and_ip( opts )
        end

        def force_sign_out( message )
          sign_out
          raise NonFatalError.new message, 401
        end

        def refresh_timestamp_and_ip( opts )
          File.write "#{@settings.data_directory_path}/current_user.json",
          current_user_tokens.merge({ timestamp: Time.now.to_i }).to_json
        end

      end
    end
  end
end
