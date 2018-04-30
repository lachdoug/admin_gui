class V0
  module Api
    module Controllers

      get '/uadmin/users/groups' do
        system.index_users_groups.to_json
      end

      get '/uadmin/users/groups/' do
        system.show_users_group( params[:dn] ).to_json
      end

    end
  end
end
