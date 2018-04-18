class V0
  module Api
    module Controllers

      get '/system/containers/apps' do
        system.app_statuses.to_json
      end

      get '/system/containers/apps/titles' do
        system.app_titles.to_json
      end

      get '/system/containers/services' do
        system.service_statuses.to_json
      end

    end
  end
end
