class V0
  module Api
    module Controllers

      post '/system/users/user/:user_uid/groups' do
        system.user_add_to_group( params[:user_uid], params[:data][:group_name] ).to_json
      end

      delete '/system/users/user/:user_uid/groups/' do
        system.user_remove_from_group( params[:user_uid], params[:data][:group_name] ).to_json
      end

      get '/system/users/user/:user_uid/new_group' do
        system.user_new_add_to_group( params[:user_uid] ).to_json
      end

      get '/system/users/user/:user_uid/groups/delete' do
        system.user_new_remove_from_group( params[:user_uid] ).to_json
      end



    end
  end
end
