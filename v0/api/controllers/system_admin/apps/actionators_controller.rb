class V0
  module Api
    module Controllers

      get '/apps/:app_name/actionators' do
        set_app( params[:app_name] )
        @app.actionators.to_json
      end

      get '/apps/:app_name/actionator' do
        set_app( params[:app_name] )
        @app.actionator( params[:actionator_name] ).to_json
      end

      post '/apps/:app_name/actionator' do
        set_app( params[:app_name] )
        @app.perform_actionator( params[:actionator_name], params[:variables] ).to_json
      end

    end
  end
end
