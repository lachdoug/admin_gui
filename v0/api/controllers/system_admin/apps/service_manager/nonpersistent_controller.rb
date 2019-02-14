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

      get '/apps/:app_name/service_manager/nonpersistent/new' do
        ## Query params: :publisher_namespace, :type_path
        set_app( params[:app_name] )
        @app.new_service( params[:publisher_namespace], params[:type_path] ).to_json
      end

      post '/apps/:app_name/service_manager/nonpersistent/' do
        ## Query params: :publisher_namespace, :type_path
        set_app( params[:app_name] )
        @app.create_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:data] ).to_json
      end

      put '/apps/:app_name/service_manager/nonpersistent/' do
        ## Query params: :publisher_namespace, :type_path
        set_app( params[:app_name] )
        @app.update_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      end

      delete '/apps/:app_name/service_manager/nonpersistent/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app( params[:app_name] )
        @app.delete_nonpersistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

    end
  end
end
