class V0
  module Api
    module Controllers

      get '/services/:service_name/instruct' do
        set_service(params[:service_name])
        @service.instruct(params[:instruction]).to_json
      end

    end
  end
end
