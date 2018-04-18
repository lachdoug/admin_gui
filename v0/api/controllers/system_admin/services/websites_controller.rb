class V0
  module Api
    module Controllers

      get '/services/:service_name/websites' do
        set_service(params[:service_name])
        @service.websites.to_json
      end

    end
  end
end
