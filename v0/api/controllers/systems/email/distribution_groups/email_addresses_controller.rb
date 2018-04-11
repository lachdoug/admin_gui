class V0
  module Api
    module Controllers

      get "/system/email/distribution_groups/email_addresses/new" do
        system.new_email_distribution_group_email_address( params[:distribution_group_name] ).to_json
      end
      #
      post "/system/email/distribution_groups/email_addresses/" do
        system.create_email_distribution_group_email_address( params[:distribution_group_name], params[:email_address] ).to_json
      end

      delete "/system/email/distribution_groups/email_addresses/" do
        system.delete_email_distribution_group_email_address( params[:distribution_group_name], params[:address] ).to_json
      end

    end
  end
end
