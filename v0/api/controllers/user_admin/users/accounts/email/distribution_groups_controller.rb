class V0
  module Api
    module Controllers

      get '/uadmin/users/email/distribution_groups/new' do
        system.new_users_account_email_distribution_group( params[:user_uid] ).to_json
      end

      post '/uadmin/users/email/distribution_groups/' do
        system.create_users_account_email_distribution_group(
          params[:user_uid], params[:distribution_group]
        ).to_json
      end

      delete '/uadmin/users/email/distribution_groups/' do
        distribution_group_name, address = params[:distribution_group_name_and_email_address].split(':')
        system.delete_email_distribution_group_email_address(
          distribution_group_name,
          address ).to_json
      end

    end
  end
end
