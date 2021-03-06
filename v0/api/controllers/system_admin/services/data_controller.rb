class V0
  module Api
    module Controllers

      get '/services/:service_name/data/export' do
        set_service(params[:service_name])
        content_type "application/octet-stream"
        stream do |out|
          @service.export( out )
        end
      end

      put '/services/:service_name/data/import' do
        set_service(params[:service_name])
        @service.import( params[:data][:file][:tempfile].read ).to_json #params[:data][:file][:tempfile].read
      end

    end
  end
end
