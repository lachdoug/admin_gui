class V0
  module Api
    module Controllers

      get "/system/domains/names/:domain_name" do
        system.domain( domain_name ).to_json
      end

      put "/system/domains/names/:domain_name" do
        system.update_domain( params[:domain_name], params[:form] ).to_json
      end

      post "/system/domains/names" do
        system.create_domain( params[:form] ).to_json
      end

      delete "/system/domains/names/:domain_name" do
        system.delete_domain( params[:domain_name] ).to_json
      end

    end
  end
end
