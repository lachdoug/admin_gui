class V0
  module Api
    module Controllers

      get '/system/certificates' do
        system.certificates.to_json
      end

      get '/system/certificates/' do
        ## Query params: :certificate_path
        send_as_file "#{ ( params[:certificate_path] ).gsub("/", "_") }.crt",
          system.certificate( params[:certificate_path] )
      end

      post '/system/certificates' do
        system.create_certificate( params[:data] ).to_json
        # ## Query params: :certificate_path
        # send_as_file "#{ ( params[:certificate_path] ).gsub("/", "_") }.crt",
        #   system.certificate( params[:certificate_path] )
      end

      get '/system/certificate_authority' do
        send_as_file "engines_certificate_authority.crt", system.certificate_authority
      end

      delete '/system/certificates/' do
        system.delete_certificate( params[:certificate_path] ).to_json
      end

    end
  end
end
