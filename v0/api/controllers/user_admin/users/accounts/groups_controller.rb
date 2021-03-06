class V0
  module Api
    module Controllers

      get '/uadmin/users/accounts/groups/new' do
        system.new_users_account_groups( params[:user_uid] ).to_json
      end

      post '/uadmin/users/accounts/groups' do
        system.create_users_account_groups( params[:user_uid], params[:groups] ).to_json
      end

      delete '/uadmin/users/accounts/groups' do
        system.delete_users_account_groups( params[:user_uid], params[:group_dns] ).to_json
      end

    end
  end
end
