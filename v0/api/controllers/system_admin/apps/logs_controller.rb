class V0
  module Api
    module Controllers

      get '/apps/:app_name/logs' do
        set_app(params[:app_name])
        @app.logs.to_json
      end

    end
  end
end
