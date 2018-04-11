class V0
  module Api
    module Controllers

      get '/system/users/accounts' do
        system.index_users_accounts.to_json
      end

      get '/system/users/accounts/' do
        system.show_users_account( params[:uid] ).to_json
      end

      delete '/system/users/accounts/' do
        system.delete_users_account( params[:uid] ).to_json
      end

      put '/system/users/accounts/' do
        system.update_users_account( params[:uid], params[:account] ).to_json
      end

      post '/system/users/accounts/' do
        system.create_users_account( params[:account] ).to_json
      end

    end
  end
end
