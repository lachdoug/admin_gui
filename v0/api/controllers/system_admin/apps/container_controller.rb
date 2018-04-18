class V0
  module Api
    module Controllers

      get '/apps/:app_name/container' do
        set_app(params[:app_name])
        @app.container.to_json
      end

    end
  end
end
