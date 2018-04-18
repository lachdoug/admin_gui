class V0
  module Api
    module Controllers

      get '/system/last_install' do
        system.last_install.to_json
      end

    end
  end
end
