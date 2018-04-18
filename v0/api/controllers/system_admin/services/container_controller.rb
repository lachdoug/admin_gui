class V0
  module Api
    module Controllers

      get '/services/:service_name/container' do
        set_service(params[:service_name])
        @service.container.to_json
      end

    end
  end
end
