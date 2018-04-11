class V0
  module Api
    module Controllers

      post '/system/shutdown' do
        system.shutdown(params[:data]).to_json
      end

    end
  end
end
