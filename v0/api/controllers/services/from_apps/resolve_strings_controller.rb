class V0
  module Api
    module Controllers

      get '/services/:service_name/resolve_strings' do
        set_service(params[:service_name])
        # byebug
        @service.resolve_strings(params[:strings]).to_json
      end

    end
  end
end
