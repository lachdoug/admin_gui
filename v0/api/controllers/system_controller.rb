class V0
  module Api
    module Controllers

      get '/system' do
        system.to_json
      end

      put '/system/select' do
        halt 404 unless settings.remote_management
        session[:system_api_url] = params[:data][:system_api_url]
        # :system_selection is an index (of which system to select from settings)
        { system_api_url: session[:system_api_url] }.to_json
      end

    end
  end
end
