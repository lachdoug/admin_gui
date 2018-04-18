class V0
  module Api
    module Controllers

      get '/uadmin/users/accounts' do
        system.index_users_accounts.to_json
      end

      get '/uadmin/users/accounts/' do
        system.show_users_account( params[:uid] ).to_json
      end

      delete '/uadmin/users/accounts/' do
        system.delete_users_account( params[:uid] ).to_json
      end

      put '/uadmin/users/accounts/' do
        system.update_users_account( params[:uid], params[:account] ).to_json
      end

      post '/uadmin/users/accounts/' do
        system.create_users_account( params[:account] ).to_json
      end

    end
  end
end
