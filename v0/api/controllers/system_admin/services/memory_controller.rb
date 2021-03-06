class V0
  module Api
    module Controllers

      get '/services/:service_name/memory' do
        set_service( params[:service_name] )
        @service.memory.to_json
      end

      put '/services/:service_name/memory' do
        set_service( params[:service_name] )
        @service.update_memory( params[:data] ).to_json
      end

    end
  end
end
