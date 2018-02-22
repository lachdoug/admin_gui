class V0
  module Api
    module Controllers

      get '/services/:service_name/consumers' do
        set_service(params[:service_name])
        @service.consumers.to_json
      end

    end
  end
end
