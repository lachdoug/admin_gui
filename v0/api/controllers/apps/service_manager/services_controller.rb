class V0
  module Api
    module Controllers

      ## List existing service consumers
      get '/apps/:app_name/service_manager/services' do
        set_app(params[:app_name])
        @app.services.to_json
      end

      ## Detail for an existing service consumer
      get '/apps/:app_name/service_manager/services/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.service_detail_for( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
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
