class V0
  module Api
    module Controllers

      get '/apps/:app_name/environment' do
        set_app( params[:app_name] )
        @app.environment.to_json
      end

      patch '/apps/:app_name/environment' do
        set_app( params[:app_name] )
        @app.update_environment( params[:form] ).to_json
      end

    end
  end
end
