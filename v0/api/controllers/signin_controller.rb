class V0
  module Api
    module Controllers

      post '/system/signin' do
        session[:system_ip] = params[:data][:system_ip]
        # byebug
        @user = User.new( system, session, request, settings )
        @user.sign_in( password: params[:data][:password] )
        { system_ip: params[:data][:system_ip] }.to_json

        #
        # if params[:data][:interface] == "system_admin"
        #   @user = User.new( system(unauthenticated: true), session, request, settings )
        #   @user.sign_in( password: params[:data][:password] )
        #   { system_ip: params[:data][:system_ip] }.to_json
        # elsif params[:data][:interface] == "user_admin"
        #   @user = LdapUser.new( system_ldap, session, request, settings )
        #   @user.sign_in( password: params[:data][:password] )
        #   { system_ip: params[:data][:system_ip] }.to_json
        # end
      end

      delete '/system/signin' do
         current_user.sign_out.to_json if current_user
         session[:system_ip] = nil
         {}.to_json
      end

    end
  end
end
