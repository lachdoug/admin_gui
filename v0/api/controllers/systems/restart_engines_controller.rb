class V0
  module Api
    module Controllers

      get '/system/restart_engines' do
        system.restart_engines.to_json
      end

    end
  end
end
