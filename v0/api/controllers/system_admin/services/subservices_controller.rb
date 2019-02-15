class V0
  module Api
    module Controllers

      get '/services/:service_name/subservices' do
        set_service(params[:service_name])
        @service.subservices.to_json
      end

    end
  end
end
