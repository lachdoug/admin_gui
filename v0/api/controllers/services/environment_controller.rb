class V0
  module Api
    module Controllers

      get '/services/:service_name/environment_variables' do
        set_service( params[:service_name] )
        @service.environment_variables.to_json
      end

      patch '/services/:service_name/environment_variables' do
        set_service( params[:service_name] )
        @service.update_environment_variables( params[:data] ).to_json
      end

    end
  end
end
