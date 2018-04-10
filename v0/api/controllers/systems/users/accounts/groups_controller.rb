class V0
  module Api
    module Controllers

      # get '/system/users/user/accounts' do
      #   system.index_users_accounts_groups( params[:user_uid] ).to_json
      # end

      get '/system/users/accounts/groups/new' do
        system.new_users_account_groups( params[:user_uid] ).to_json
      end

      post '/system/users/accounts/groups' do
        system.create_users_account_groups( params[:user_uid], params[:groups] ).to_json
      end

      delete '/system/users/accounts/groups' do
        system.delete_users_account_groups( params[:user_uid], params[:names] ).to_json
      end

      # get '/system/users/user/accounts/new' do
      #   system.user_new_add_to_group( params[:user_uid] ).to_json
      # end

      # get '/system/users/accounts/groups/delete' do
      #   system.delete_users_accounts_group( params[:user_uid] ).to_json
      # end



    end
  end
end
