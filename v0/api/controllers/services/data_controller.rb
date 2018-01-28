class V0
  module Api
    module Controllers

      get '/services/:service_name/data/export' do
        set_service(params[:service_name])
        send_as_file("engines_data_export_#{@service.name}__"\
          "#{Time.now.utc}.gzip",
          @service.export).to_json
      end

      put '/services/:service_name/data/import' do
        set_service(params[:service_name])
        @service.import( params[:data][:file][:tempfile].read ).to_json #params[:data][:file][:tempfile].read
      end

    end
  end
end
