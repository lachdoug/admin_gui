class V0
  module Api
    module Controllers

      ## Detail for an existing persistent service consumer
      get '/apps/:app_name/service_manager/persistent/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.persistent_service_detail_for( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end

      ## Update an existing persistent service consumer
      put '/apps/:app_name/service_manager/persistent/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.update_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      end

      ## Delete an existing persistent service consumer
      delete '/apps/:app_name/service_manager/persistent/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.delete_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      end

      ## List available service consumers for a persistent service type
      get '/apps/:app_name/service_manager/persistent/available' do
        ## Query params: :publisher_namespace, :type_path
        set_app(params[:app_name])
        @app.available_persistent_services_for(params[:publisher_namespace], params[:type_path]).to_json
      end

      post '/apps/:app_name/service_manager/persistent/create_new' do
        set_app( params[:app_name] )
        @app.create_new_persistent_service( params[:publisher_namespace], params[:type_path], params[:data] ).to_json
      end

      post '/apps/:app_name/service_manager/persistent/share_existing' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.share_existing_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:parent], params[:data] ).to_json
      end

      post '/apps/:app_name/service_manager/persistent/adopt_orphan' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.adopt_orphan_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:parent], params[:data] ).to_json
      end

      get '/apps/:app_name/service_manager/persistent/export' do
        set_app(params[:app_name])
        content_type "application/octet-stream"
        stream do |out|
          @app.export_persistent_service_stream( params, out )
        end
      end

      post '/apps/:app_name/service_manager/persistent/import/' do
        ## Query params: :publisher_namespace, :type_path, :service_handle
        set_app(params[:app_name])
        @app.import_persistent_service( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] )
      end

    end
  end
end
