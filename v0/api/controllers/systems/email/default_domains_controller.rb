class V0
  module Api
    module Controllers

      get '/system/email/default_domain/new' do
        system.new_email_default_domain.to_json
      end

      post '/system/email/default_domain' do
        system.create_email_default_domain( params[:default_domain] ).to_json
      end

      put '/system/email/default_domain' do
        system.update_email_default_domain( params[:default_domain] ).to_json
      end

    end
  end
end
