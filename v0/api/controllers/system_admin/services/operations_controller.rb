class V0
  module Api
    module Controllers

      get '/services/:service_name/operations' do
        set_service( params[:service_name] )
        @service.operations.to_json
      end

      get '/services/:service_name/operation' do
        set_service( params[:service_name] )
        @service.operation( params[:operation_name] ).to_json
      end

      # post '/services/:service_name/operation' do
      #   set_service( params[:service_name] )
      #   @service.perform_operation( params[:operation_name], params[:variables] ).to_json
      # end

    end
  end
end
