class V0
  module Api
    module Controllers

      get '/system/users/groups' do
        system.index_users_groups.to_json
      end

      get '/system/users/groups/' do
        system.show_users_group( params[:name] ).to_json
      end

    end
  end
end
