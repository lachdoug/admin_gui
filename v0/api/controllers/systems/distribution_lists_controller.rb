class V0
  module Api
    module Controllers

      get '/system/email/distribution_lists' do
        system.distribution_lists.to_json
      end

      get '/system/email/distribution_lists/new' do
        system.distribution_lists_new.to_json
      end

      post '/system/email/distribution_lists' do
        system.distribution_lists_create( params[:data] ).to_json
      end

      get "/system/email/distribution_list" do
        system.distribution_list( params[:distribution_list_name] ).to_json
      end

      get "/system/email/distribution_list/edit" do
        system.distribution_list_edit( params[:distribution_list_name] ).to_json
      end

      put "/system/email/distribution_list" do
        system.distribution_list_update( params[:distribution_list_name], params[:data] ).to_json
      end

      delete "/system/email/distribution_list" do
        system.distribution_list_delete( params[:distribution_list_name] ).to_json
      end

      get "/system/email/distribution_list/email_addresses/new" do
        system.distribution_list_new_email_address( params[:distribution_list_name] ).to_json
      end

      post "/system/email/distribution_list/email_addresses" do
        system.distribution_list_create_email_address( params[:distribution_list_name], params[:email_address] ).to_json
      end

      delete "/system/email/distribution_list/email_address" do
        system.distribution_list_delete_email_address( params[:distribution_list_name], params[:email_address] ).to_json
      end


    end
  end
end
