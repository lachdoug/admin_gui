class V0
  module Api
    module Controllers

      get '/system/install' do
        system.new_app(params[:blueprint_url]).to_json
      end

      post "/system/install" do
        system.install(params[:form]).to_json
      end

    end
  end
end
