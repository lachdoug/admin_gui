class V0
  module Api
    module Controllers

      get '/services/:service_name/actions' do
        set_service( params[:service_name] )
        @service.actions.to_json
      end

      get '/services/:service_name/action' do
        set_service( params[:service_name] )
        @service.action( params[:actionator_name] ).to_json
      end

      post '/services/:service_name/action' do
        set_service( params[:service_name] )
        @service.perform_action( params[:actionator_name], params[:variables] ).to_json
      end

    end
  end
end
