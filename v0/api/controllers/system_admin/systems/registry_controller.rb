class V0
  module Api
    module Controllers

      get '/system/registry' do
        system.registry.to_json
      end

    end
  end
end
