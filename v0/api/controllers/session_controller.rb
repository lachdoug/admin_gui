class V0
  module Api
    module Controllers

      post '/session' do
        @user = User.new( session, settings )
        @user.sign_in( system( without_token: true ), params[:data] )
        { username: @user.username }.to_json
      end

      delete '/session' do
         current_user.sign_out.to_json if current_user
         {}.to_json
      end

    end
  end
end
