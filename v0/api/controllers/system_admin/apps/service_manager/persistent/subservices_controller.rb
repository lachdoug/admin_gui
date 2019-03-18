class V0
  module Api
    module Controllers

      get '/apps/:app_name/service_manager/persistent/subservices/new_type' do
        set_app(params[:app_name])
        @app.new_type_of_subservice( params[:service_handle], params[:publisher_namespace], params[:type_path] ).to_json
      end

      get '/apps/:app_name/service_manager/persistent/subservices/new' do
        set_app( params[:app_name] )
        @app.new_subservice(
          params[:service_handle],
          params[:publisher_namespace],
          params[:type_path],
          params[:sub_publisher_namespace],
          params[:sub_type_path],
          params[:sub_container_name]
        ).to_json
      end

      post '/apps/:app_name/service_manager/persistent/subservices/' do
        set_app( params[:app_name] )
        @app.create_subservice(
          params[:service_handle],
          params[:service_publisher_namespace],
          params[:service_type_path],
          params[:sub_publisher_namespace],
          params[:sub_type_path],
          params[:sub_container_name],
          params[:variables]
          ).to_json
      end

      put '/apps/:app_name/service_manager/persistent/subservices/' do
        set_app( params[:app_name] )
        @app.update_subservice( params[:publisher_namespace], params[:type_path], params[:service_handle], params[:data] ).to_json
      end

      delete '/apps/:app_name/service_manager/persistent/subservices/' do
        set_app( params[:app_name] )
        @app.delete_subservice( params[:publisher_namespace], params[:type_path], params[:service_handle] ).to_json
      end



    end
  end
end
