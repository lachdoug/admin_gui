class V0
  module Api
    module Controllers

      get '/system/default_site' do
        system.default_site.to_json
      end

      put "/system/default_site" do
        system.update_default_site(params[:data]).to_json
      end

    end
  end
end
