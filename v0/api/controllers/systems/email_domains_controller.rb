class V0
  module Api
    module Controllers

      get '/system/email_domains' do
        system.email_domains.to_json
      end

      get '/system/email_domains/setup' do
        system.email_domains_new_setup.to_json
      end

      put '/system/email_domains/setup' do
        system.email_domains_create_setup( params[:data] ).to_json
      end

      # get '/system/email_domains/email_domain/new' do
      #   system.new_email_domain.to_json
      # end

      get '/system/email_domains/email_domain/' do
        system.email_domain( params[:email_domain] ).to_json
      end

      get '/system/email_domains/delete' do
        system.deletable_email_domains.to_json
      end

      delete '/system/email_domains/email_domain/' do
        system.delete_email_domain( params[:data][:email_domain] ).to_json
      end

      get '/system/email_domains/new' do
        system.new_email_domain.to_json
      end

      post '/system/email_domains' do
        system.create_email_domain( params[:data] ).to_json
      end

      # get '/system/email_domains/default' do
      #   system.default_email_domain.to_json
      # end

      put '/system/email_domains/default' do
        system.set_default_email_domain( params[:data] ).to_json
      end

    end
  end
end
