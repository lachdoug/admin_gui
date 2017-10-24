class V0
  module Api
    module Controllers

      get '/services/:service_name/build_report' do
        set_service(params[:service_name])
        @service.build_report.to_json
      end

    end
  end
end
