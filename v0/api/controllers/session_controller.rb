class V0
  module Api
    module Controllers

      post '/session' do
        User.new( user_tracking_id, settings ).sign_in( system( without_token: true ), params[:form] ).to_json
      end

      delete '/session' do
        current_user.sign_out.to_json
      end

    end
  end
end
