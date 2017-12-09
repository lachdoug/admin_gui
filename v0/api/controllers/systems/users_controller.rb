class V0
  module Api
    module Controllers

      get '/system/users' do
        system.users.to_json
      end

      get '/system/users/user/:user_id' do
        system.user( params[:user_id] ).to_json
      end

    end
  end
end
