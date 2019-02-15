class V0
  module Api
    module Controllers

      ## List existing service consumers
      get '/apps/:app_name/service_manager/services' do
        set_app(params[:app_name])
        @app.services.to_json
      end

      ## List available service
      get '/apps/:app_name/service_manager/available' do
        set_app(params[:app_name])
        @app.available_services.to_json
      end

      ## Services full detail
      get '/apps/:app_name/service_manager/report' do
        set_app(params[:app_name])
        @app.services_report.to_json
      end

    end
  end
end
