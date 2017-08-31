class V0
  module Api
    module Controllers

      get '/apps/:app_name/about' do
        set_app(params[:app_name])
        @app.about.to_json
      end

    end
  end
end
