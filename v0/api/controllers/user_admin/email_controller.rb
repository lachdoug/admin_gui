class V0
  module Api
    module Controllers

      get '/uadmin/email' do
        system.show_email.to_json
      end

    end
  end
end
