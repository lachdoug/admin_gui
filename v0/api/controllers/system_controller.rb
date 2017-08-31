class V0
  module Api
    module Controllers

      get '/system' do
        # byebug
        system.to_json
      end

    end
  end
end
