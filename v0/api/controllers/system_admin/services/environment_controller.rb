class V0
  module Api
    module Controllers

      get '/services/:service_name/environment_variables' do
        set_service( params[:service_name] )
        @service.environment_variables.to_json
      end

    end
  end
end
