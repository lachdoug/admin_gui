class V0
  module Api
    module Controllers

      get '/system/email/email_addresses' do
        system.index_email_email_addresses.to_json
      end

    end
  end
end
