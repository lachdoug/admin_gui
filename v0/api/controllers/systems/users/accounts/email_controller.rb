class V0
  module Api
    module Controllers

      post '/system/users/accounts/email' do
        system.create_users_account_email( params[:user_uid], params[:email] ).to_json
      end

      get '/system/users/accounts/email/edit' do
        system.edit_users_account_email( params[:user_uid] ).to_json
      end

      put '/system/users/accounts/email' do
        system.update_users_account_email( params[:user_uid], params[:email] ).to_json
      end

      delete '/system/users/accounts/email' do
        system.delete_users_account_email( params[:user_uid] ).to_json
      end

    end
  end
end
