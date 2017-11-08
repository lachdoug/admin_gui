class V0
  module Api
    module Controllers

      get '/apps/:app_name/actions' do
        set_app( params[:app_name] )
        @app.actions.to_json
      end

      post '/apps/:app_name/action' do
        set_app( params[:app_name] )
        @app.perform_action( params[:actionator_name], params[:variables] ).to_json
      end

    end
  end
end
