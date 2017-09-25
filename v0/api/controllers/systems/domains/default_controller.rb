class V0
  module Api
    module Controllers

      # get "/system/domains/default" do
      #   system.default_domain.to_json
      # end

      put "/system/domains/default" do
        system.update_default_domain( params[:data] ).to_json
      end

    end
  end
end
