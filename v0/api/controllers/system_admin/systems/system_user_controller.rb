class V0
  module Api
    module Controllers

      get '/system/system_user' do
        system.system_user.to_json
      end

      patch "/system/system_user/email" do
        system.update_system_user_email(params[:system_user]).to_json
      end

      patch "/system/system_user/password" do
        system.update_system_user_password(params[:system_user]).to_json
      end

    end
  end
end
