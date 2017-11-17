class V0
  module Api
    module Controllers

      post '/system/signin' do
        @user = User.new( session, settings )
        byebug
        @user.sign_in( system( without_token: true ), params[:data].merge( { ip_address: request.ip } ) )
        { username: @user.username }.to_json
      end

      delete '/system/signin' do
         current_user.sign_out.to_json if current_user
         {}.to_json
      end

    end
  end
end
