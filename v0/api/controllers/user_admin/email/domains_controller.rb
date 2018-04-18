class V0
  module Api
    module Controllers

      get '/uadmin/email/domains/new' do
        system.new_email_domain.to_json
      end

      post '/uadmin/email/domains/' do
        system.create_email_domain( params[:domain] ).to_json
      end

      delete '/uadmin/email/domains/' do
        system.delete_email_domain( params[:name] ).to_json
      end

    end
  end
end
