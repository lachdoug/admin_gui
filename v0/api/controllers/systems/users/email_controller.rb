class V0
  module Api
    module Controllers

      get '/system/users/user/:user_uid/email' do
        system.user_email( params[:user_uid] ).to_json
      end

      put '/system/users/user/:user_uid/setup_email' do
        system.user_setup_email( params[:user_uid],
            params[:data][:domain] ).to_json
      end

      put '/system/users/user/:user_uid/disable_email' do
        system.user_disable_email( params[:user_uid] ).to_json
      end

    end
  end
end
