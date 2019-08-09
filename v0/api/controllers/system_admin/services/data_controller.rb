class V0
  module Api
    module Controllers

      get '/services/:service_name/data/export' do
        set_service(params[:service_name])
        content_type "application/octet-stream"

        # headers['Content-Type'] = file.content_type
        # headers['Content-Disposition'] = 'attachment'

        stream do |out|
          @service.export( out )
        end
      end

      # put '/services/:service_name/data/import' do
      #   set_service(params[:service_name])
      #   @service.import( params[:data][:file][:tempfile].read ).to_json #params[:data][:file][:tempfile].read
      # end

      post '/services/:service_name/data/import/chunked' do
        set_service(params[:service_name])

        query = {
          upload_id: params[:dzuuid],
          total_file_size: params[:dztotalfilesize],
          total_chunks: params[:dztotalchunkcount],
          chunk_index: params[:dzchunkindex],
          chunk_byte_offset: params[:dzchunkbyteoffset],
        }

        encoded_query = URI.encode_www_form query

        RestClient::Request.execute(
          method: :post,
          url: "https://#{session[:system_ip]}:2380/v0/containers/service/:service_name/import/chunked?#{ encoded_query }",
          payload: params[:file][:tempfile].read,
          contentType: 'application/octet-stream',
          timeout: 120,
          verify_ssl: false,
          headers: {
            access_token: current_user.system_api_token
          }
        )

      end


    end
  end
end
