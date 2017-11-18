class V0
  module Api
    module Controllers

      get '/system/service_certificates' do
        system.service_certificates.to_json
      end

      put "/system/service_certificates/:service_name" do
        system.update_service_certificate(
          service_name: params[:service_name],
          certificate: params[:data][:certificate],
        ).to_json
      end

    end
  end
end
