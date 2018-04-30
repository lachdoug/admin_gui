class V0
  module Api
    module Controllers

      get '/system/api_admin' do
        system.api_admin_user.to_json
      end

      patch "/system/api_admin/email" do
        system.update_api_admin_user_email(params[:api_admin]).to_json
      end

      patch "/system/api_admin/password" do
        system.update_api_admin_user_password(params[:api_admin]).to_json
      end

    end
  end
end
