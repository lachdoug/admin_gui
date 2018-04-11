class V0
  module Api
    module Controllers

      post '/system/signin' do
        session[:system_ip] = params[:data][:system_ip]
        @user = User.new( session, settings )
        @user.sign_in( system( without_token: true ), params[:data].merge( { ip_address: request.ip } ) )
        { system_ip: params[:data][:system_ip] }.to_json
      end

      delete '/system/signin' do
         current_user.sign_out.to_json if current_user
         session[:system_ip] = nil
         {}.to_json
      end

    end
  end
end
