class V0
  module Api
    module Controllers

      get '/system/users_groups' do
        system.user_groups.to_json
      end

    end
  end
end
