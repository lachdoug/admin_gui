class V0
  module Api
    module Controllers

      post '/apps/:app_name/actions' do
        byebug
        set_app( params[:app_name] )
        @app.perform_action( params[:actionator_name], params[:variables] ).to_json
      end

    end
  end
end
