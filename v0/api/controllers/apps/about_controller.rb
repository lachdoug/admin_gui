class V0
  module Api
    module Controllers

      get '/apps/:app_name/about' do
        set_app(params[:app_name])
        @app.about.to_json
      end

      get '/apps/:app_name/icon' do
        set_app(params[:app_name])
        @app.icon_url.to_json
      end

      put '/apps/:app_name/icon' do
        set_app(params[:app_name])
        @app.update_icon_url( params[:data] ).to_json
      end

    end
  end
end
