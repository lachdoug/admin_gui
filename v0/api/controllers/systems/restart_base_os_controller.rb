class V0
  module Api
    module Controllers

      get '/system/restart_base_os' do
        system.restart_base_os.to_json
      end

    end
  end
end
