class V0
  module Api
    module Controllers

      get '/apps/:app_name/network' do
        set_app( params[:app_name] )
        @app.network.to_json
      end

      put '/apps/:app_name/network' do
        set_app( params[:app_name] )
        @app.update_network( params[:data] ).to_json
      end

    end
  end
end
