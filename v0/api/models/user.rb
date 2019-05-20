class V0
  module Api
    module Models
      class User

        def initialize( session, request, settings )
          @session = session
          @request = request
          @settings = settings
        end

        def sign_in( system, data )
          api_token = system.sign_in( { password: data[:password], ip_address: @request.ip } )
          store_system_api_token api_token
        end

        def sign_out
          @session.clear
        end

        def authenticated?(opts={})
          force_sign_out "Not signed in." unless system_api_token
          check_timeout( opts )
          return true
        end

        def system_api_token
          @session[:system_api_token]
        end

        def signin_timeout?
          time_now = Time.now.to_i
          time_of_last_activity = @session[:activity_timestamp]
          seconds_since_last_activity = time_now - time_of_last_activity
          timeout_seconds = @settings.user_inactivity_timeout
          # puts "------\nCheck timeout at #{ time_now }.\n"
          # puts "Session:\n#{ @session.to_h.to_yaml }"
          # puts "time_now: #{ time_now }"
          # puts "time_of_last_activity: #{ time_of_last_activity }"
          # puts "seconds_since_last_activity: #{ seconds_since_last_activity }"
          # puts "timeout_seconds: #{ timeout_seconds }"
          seconds_since_last_activity > timeout_seconds
        end

        private

        def session_id
          @session[:tracking]["HTTP_USER_AGENT"]
        end

        def store_system_api_token(new_system_api_token)
          @session[:system_api_token] = new_system_api_token
          time_now = Time.now.to_i
          # puts "------\nStoring timestamp for user timeout at #{ time_now }.\n"
          @session[:activity_timestamp] = time_now
        end

        def check_timeout( opts )
          force_sign_out "Signed out due to inactivity." if signin_timeout?
          refresh_timestamp unless opts[:skip_timeout_update]
        end

        def force_sign_out( message )
          sign_out
          raise NonFatalError.new message, 401
        end

        def refresh_timestamp
          time_now = Time.now.to_i
          # puts "------\nRefresh timestamp at #{ time_now }.\n"
          # debugger
          @session[:activity_timestamp] = time_now
        end

      end
    end
  end
end
