class V0
  module Api
    module Controllers

      get '/services/:service_name/actionators' do
        set_service( params[:service_name] )
        @service.actionators.to_json
      end

      get '/services/:service_name/actionator' do
        set_service( params[:service_name] )
        @service.actionator( params[:actionator_name] ).to_json
      end

      post '/services/:service_name/actionator' do
        set_service( params[:service_name] )
        @service.perform_actionator( params[:actionator_name], params[:variables] ).to_json
      end

    end
  end
end
