class V0
  module Api
    module Controllers

      post '/services/:service_name/uninstall' do
        set_service(params[:service_name])
        @service.uninstall(delete_service_data: params[:data]).to_json
      end

    end
  end
end
