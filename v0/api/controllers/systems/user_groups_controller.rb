class V0
  module Api
    module Controllers

      get '/system/users/groups' do
        system.index_users_groups.to_json
      end

      get '/system/users/groups/' do
        system.show_users_group( params[:name] ).to_json
      end

      #
      # # get '/system/user_groups' do
      # #   system.user_groups.to_json
      # # end
      #
      # get '/system/user_group' do
      #   system.user_group( params[:user_group_name] ).to_json
      # end

    end
  end
end
