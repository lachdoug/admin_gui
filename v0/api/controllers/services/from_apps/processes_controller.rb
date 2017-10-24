class V0
  module Api
    module Controllers

      get '/services/:service_name/processes' do
        set_service(params[:service_name])
        @service.processes.to_json
      end

    end
  end
end
