class V0
  module Api
    module Controllers

      get '/system/email_addresses' do
        system.email_addresses.to_json
      end

      get '/system/email_addresses/email_address/' do
        system.email_address(params[:email_address]).to_json
      end


      # get '/system/users/user/:user_uid' do
      #   system.user( params[:user_uid] ).to_json
      # end
      #
      # post '/system/users/user' do
      #   system.create_user( params[:data] ).to_json
      # end

    end
  end
end
