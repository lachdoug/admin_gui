class V0
  module Api
    module Controllers

      put '/system/users/user/:user_uid/email_addresses' do
        system.user_add_email_address( params[:user_uid],
          "#{params[:data][:email_address][:local_part]}@#{
            params[:data][:email_address][:domain]}" ).to_json
      end

      delete '/system/users/user/:user_uid/email_addresses/' do
        system.user_remove_email_address( params[:user_uid], params[:data][:email_address] ).to_json
      end

      get '/system/users/user/:user_uid/new_email_address' do
        system.user_new_add_email_address( params[:user_uid] ).to_json
      end

      get '/system/users/user/:user_uid/remove_email_address' do
        system.user_new_remove_email_address( params[:user_uid] ).to_json
      end

    end
  end
end
