class V0
  module Api
    module Controllers

      get "/system/ssh_keys/private" do
        send_as_file "engines_private_ssh_key.rsa", system.private_ssh_key
      end

      get "/system/ssh_keys/public" do
        send_as_file "engines_public_ssh_key.rsa", system.public_ssh_key
      end

      put "/system/ssh_keys/public" do
        system.update_public_ssh_key( params[:form] ).to_json
      end

    end
  end
end
