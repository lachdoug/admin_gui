class V0
  module Api
    module Controllers

      get '/services/:service_name/configurations' do
        set_service( params[:service_name] )
        @service.configurations.to_json
      end

      get '/services/:service_name/configuration' do
        set_service( params[:service_name] )
        @service.configuration(params[:configurator_name]).to_json
      end

      get '/services/:service_name/configuration/edit' do
        set_service( params[:service_name] )
        @service.configuration_edit(params[:configurator_name]).to_json
      end

      patch '/services/:service_name/configuration' do
        set_service( params[:service_name] )
        @service.perform_configuration( params[:configurator_name], params[:variables] ).to_json
      end

    end
  end
end
