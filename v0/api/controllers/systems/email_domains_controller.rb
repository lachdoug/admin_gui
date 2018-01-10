class V0
  module Api
    module Controllers

      get '/system/email_domains' do
        system.email_domains.to_json
      end

      # get '/system/email_domains/email_domain/new' do
      #   system.new_email_domain.to_json
      # end

      get '/system/email_domains/email_domain/' do
        system.email_domain( params[:email_domain] ).to_json
      end

      post '/system/email_domains' do
        system.create_email_domain( params[:data] ).to_json
      end

    end
  end
end
