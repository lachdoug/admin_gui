class V0
  module Api
    module Controllers

      ## Register an existing non-persistent service consumer
      put '/apps/:app_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.register_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Deregister an existing non-persistent service consumer
      delete '/apps/:app_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.deregister_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Reregister an existing non-persistent service consumer
      patch '/apps/:app_name/service_manager/nonpersistent/registration/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.reregister_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

    end
  end
end
