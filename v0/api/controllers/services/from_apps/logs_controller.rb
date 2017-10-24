class V0
  module Api
    module Controllers

      get '/services/:service_name/logs' do
        set_service(params[:service_name])
        @service.logs.to_json
      end

    end
  end
end
