class V0
  module Api
    module Controllers

      get '/system/update_engines' do
        system.update_engines.to_json
      end

    end
  end
end
