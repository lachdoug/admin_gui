class V0
  module Api
    module Controllers

      put '/system/users/accounts/password' do
        system.update_users_account_password( params[:user_uid], params[:password] ).to_json
      end

    end
  end
end
