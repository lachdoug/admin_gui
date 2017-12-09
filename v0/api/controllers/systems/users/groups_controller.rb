class V0
  module Api
    module Controllers

      put '/system/users/user/:user_id/groups/:group_name' do
        system.add_user_to_group( params[:user_id], params[:group_name] ).to_json
      end

      delete '/system/users/user/:user_id/groups/:group_name' do
        system.remove_user_from_group( params[:user_id], params[:group_name] ).to_json
      end

      get '/system/users/groups' do
        system.user_groups.to_json
      end

    end
  end
end
