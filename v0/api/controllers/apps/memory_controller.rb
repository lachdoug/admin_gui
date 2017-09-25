class V0
  module Api
    module Controllers

      get '/apps/:app_name/memory' do
        set_app( params[:app_name] )
        @app.memory.to_json
      end

      put '/apps/:app_name/memory' do
        set_app( params[:app_name] )
        @app.update_memory( params[:data] ).to_json
      end

    end
  end
end
