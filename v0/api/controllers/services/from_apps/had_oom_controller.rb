class V0
  module Api
    module Controllers

      delete '/services/:service_name/had_oom' do
        set_service(params[:service_name])
        @service.clear_had_oom.to_json
      end

    end
  end
end
