class V0
  module Api
    module Controllers

      post '/system/signin' do
        session[:system_ip] = params[:data][:system_ip]
        User.new( session, request, settings ).sign_in(
          unauthenticated_system, password: params[:data][:password] )
        { system_ip: params[:data][:system_ip] }.to_json
      end

      delete '/system/signin' do
         current_user.sign_out
         {}.to_json
      end

    end
  end
end
