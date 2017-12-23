class V0
  module Api
    module Controllers

      get '/system/users' do
        system.users.to_json
      end

      # get '/system/users/user/new' do
      #   system.new_user.to_json
      # end

      get '/system/users/user/:user_uid' do
        system.user( params[:user_uid] ).to_json
      end

      post '/system/users/user' do
        system.create_user( params[:data] ).to_json
      end

    end
  end
end
