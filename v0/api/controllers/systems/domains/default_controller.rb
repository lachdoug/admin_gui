class V0
  module Api
    module Controllers

      put "/system/domains/default" do
        system.update_default_domain( params[:data] ).to_json
      end

    end
  end
end
