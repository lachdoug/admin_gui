class V0
  module Api
    module Models
      class User

        attr_reader :username

        def initialize( session, settings )
          @session = session
          @settings = settings
          FileUtils.touch "#{@settings.data_directory_path}/current_user.json"
        end

        def sign_in( system, data )
          api_token = system.sign_in( { username: :admin, password: data[:password], ip_address: data[:ip_address] } )
          save_current_user api_token
        end

        def sign_out
          save_current_user(nil)
        end

        def authenticated?(opts={})
          ( session_id == stored_session_id ) &&
          ( opts[:skip_timeout] || check_timeout )
        end

        def system_api_token
          current_user_tokens[:system_api_token]
        end

        def within_timeout?
          ( Time.now.to_i - current_user_tokens[:timestamp].to_i ) < @settings.user_inactivity_timeout
        end

        private

        def session_id
          @session[:tracking]["HTTP_USER_AGENT"]
        end

        def save_current_user(new_system_api_token)
          File.write "#{@settings.data_directory_path}/current_user.json",
           {
             system_api_token: new_system_api_token,
             session_id: new_system_api_token ? session_id : nil,
             timestamp: new_system_api_token ? Time.now.to_i : 0
           }.to_json
        end

        def current_user_tokens
          @current_user_tokens ||=
          begin
            JSON.parse ( File.read "#{@settings.data_directory_path}/current_user.json" ), symbolize_names: true
          rescue
            {}
          end
        end

        def stored_session_id
          current_user_tokens[:session_id]
        end

        def check_timeout
          if current_user_tokens[:timestamp]
            if within_timeout?
              refresh_timestamp
            else
              sign_out
              raise NonFatalError.new "Signed out due to inactivity.", 401
            end
          end
        end

        def refresh_timestamp
          File.write "#{@settings.data_directory_path}/current_user.json",
           {
             system_api_token: system_api_token,
             session_id: session_id,
             timestamp: Time.now.to_i
           }.to_json
        end

      end
    end
  end
end
