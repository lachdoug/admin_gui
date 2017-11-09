class V0
  module Api
    module Controllers

      ## Register an existing non-persistent service consumer
      put '/services/:service_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_service(params[:service_name])
        @service.register_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Deregister an existing non-persistent service consumer
      delete '/services/:service_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_service(params[:service_name])
        @service.deregister_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Reregister an existing non-persistent service consumer
      patch '/services/:service_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_service(params[:service_name])
        @service.reregister_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

    end
  end
end
