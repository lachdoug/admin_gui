class V0
  module Api
    module Controllers

      get '/uadmin/email/distribution_groups' do
        system.index_email_distribution_groups.to_json
      end

      post '/uadmin/email/distribution_groups/' do
        system.create_email_distribution_group( params[:distribution_group] ).to_json
      end

      get "/uadmin/email/distribution_groups/" do
        system.show_email_distribution_group( params[:name] ).to_json
      end

      get "/uadmin/email/distribution_groups/edit" do
        system.edit_email_distribution_group( params[:name] ).to_json
      end

      put "/uadmin/email/distribution_groups/" do
        system.update_email_distribution_group( params[:name], params[:distribution_group] ).to_json
      end

      delete "/uadmin/email/distribution_groups/" do
        system.delete_email_distribution_group( params[:name] ).to_json
      end

    end
  end
end
