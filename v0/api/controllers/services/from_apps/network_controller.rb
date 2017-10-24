class V0
  module Api
    module Controllers

      get '/services/:service_name/network' do
        set_service( params[:service_name] )
        @service.network.to_json
      end

      put '/services/:service_name/network' do
        set_service( params[:service_name] )
        @service.update_network( params[:data] ).to_json
      end

    end
  end
end
