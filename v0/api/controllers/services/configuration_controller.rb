class V0
  module Api
    module Controllers

      get '/services/:service_name/configuration' do
        set_service( params[:service_name] )
        @service.configurations.to_json
      end

      post '/services/:service_name/configuration' do
        set_service( params[:service_name] )
        @service.perform_configuration( params[:configurator_name], params[:variables] ).to_json
      end

    end
  end
end
