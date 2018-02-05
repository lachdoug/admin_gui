class V0
  module Api
    module Controllers

      ## List existing service consumers
      get '/services/:service_name/service_manager/services' do
        set_service(params[:service_name])
        @service.services.to_json
      end

      ## Detail for an existing service consumer
      get '/services/:service_name/service_manager/services/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_service(params[:service_name])
        @service.service_detail_for( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Services full detail
      get '/services/:service_name/service_manager/report' do
        set_service(params[:service_name])
        @service.services_report.to_json
      end

    end
  end
end
