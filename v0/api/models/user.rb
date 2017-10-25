class V0
  module Api
    module Models
      class User

        def initialize( request_session_id, settings )
          @request_session_id = request_session_id
          @settings = settings
          FileUtils.touch "#{@settings.data_directory_path}/current_user.json"
        end

        def sign_in( system, form_params )
          api_token = system.sign_in( { user_name: :admin, password: form_params[:password] } )
          save_current_user api_token
          { user: :admin }
        end

        def sign_out
          save_current_user(nil)
          { user: nil }
        end

        def authenticated?
          ( @request_session_id == session_id ) && within_timeout?
        end

        def system_api_token
          current_user_tokens[:system_api_token]
        end

        private

        def save_current_user(new_system_api_token)
          File.write "#{@settings.data_directory_path}/current_user.json",
           {
             system_api_token: new_system_api_token,
             session_id: new_system_api_token ? @request_session_id : nil,
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

        def session_id
          current_user_tokens[:session_id]
        end

        def within_timeout?
          if current_user_tokens[:timestamp]
            if in_time?
              refresh_timestamp
            else
              sign_out
              raise NonFatalError.new "Signed out due to inactivity.", 401
            end
          end
        end

        def in_time?
          ( Time.now.to_i - current_user_tokens[:timestamp] ) < @settings.user_inactivity_timeout
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
