class V0
  module Api
    module Controllers

      get '/system/email' do
        system.show_email.to_json
      end

    end
  end
end
