class V0
  module Api
    module Controllers

      post '/uadmin/users/email/aliases/' do
        system.create_users_email_alias( params[:user_uid], params[:alias] ).to_json
      end

      delete '/uadmin/users/email/aliases/' do
        system.delete_users_email_alias( params[:user_uid], params[:address] ).to_json
      end

    end
  end
end
