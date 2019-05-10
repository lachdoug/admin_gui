class V0
  module Api
    module Controllers

      get '/apps/:app_name/operations' do
        set_app( params[:app_name] )
        @app.operations.to_json
      end

      get '/apps/:app_name/operation' do
        set_app( params[:app_name] )
        @app.operation( params[:operation_name] ).to_json
      end

      # post '/apps/:app_name/operation' do
      #   set_app( params[:app_name] )
      #   @app.perform_operation( params[:operation_name], params[:variables] ).to_json
      # end

    end
  end
end
