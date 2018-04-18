class V0
  module Api
    module Controllers

      get '/system/reserved_names' do
        system.reserved_names.to_json
      end

    end
  end
end
