class V0
  module Api
    module Controllers

      get '/system/statistics' do
        system.statistics.to_json
      end

    end
  end
end
