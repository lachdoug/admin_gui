class V0
  module Api
    module Controllers

    get '/services/:service_name/service_definition' do
      set_service(params[:service_name])
      @service.service_definition.to_json
    end

    end
  end
end
