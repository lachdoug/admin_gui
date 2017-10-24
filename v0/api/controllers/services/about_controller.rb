class V0
  module Api
    module Controllers

      get '/services/:service_name/about' do
        set_service(params[:service_name])
        @service.about.to_json
      end

    end
  end
end
