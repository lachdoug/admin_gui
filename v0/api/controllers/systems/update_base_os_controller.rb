class V0
  module Api
    module Controllers

      get '/system/update_base_os' do
        system.update_base_os.to_json
      end

    end
  end
end
