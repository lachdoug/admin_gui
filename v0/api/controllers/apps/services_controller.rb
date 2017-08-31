class V0
  module Api
    module Controllers

      get '/apps/:app_name/services' do
        set_app(params[:app_name])
        @app.services.to_json
      end

      get '/apps/:app_name/available_services' do
        set_app(params[:app_name])
        @app.available_services.to_json
      end

      get '/apps/:app_name/available_services/persistent/:definition_id' do
        set_app(params[:app_name])
        @app.available_persistent_service_for(params[:definition_id]).to_json
      end

    end
  end
end
