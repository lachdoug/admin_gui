class V0
  module Api
    module Controllers

      get '/system/email/domains/new' do
        system.new_email_domain.to_json
      end

      post '/system/email/domains/' do
        system.create_email_domain( params[:domain] ).to_json
      end

      delete '/system/email/domains/' do
        system.delete_email_domain( params[:name] ).to_json
      end

    end
  end
end
