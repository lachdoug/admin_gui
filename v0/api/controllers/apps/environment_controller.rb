class V0
  module Api
    module Controllers

      get '/apps/:app_name/environment_variables' do
        set_app( params[:app_name] )
        @app.environment.to_json
      end

      patch '/apps/:app_name/environment_variables' do
        set_app( params[:app_name] )
        @app.update_environment_variables( params[:data] ).to_json
      end

      post '/apps/:app_name/environment_variables' do
        set_app( params[:app_name] )
        @app.create_environment_variable( params[:data] ).to_json
      end

    end
  end
end
