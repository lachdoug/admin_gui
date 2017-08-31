class V0
  module Api
    module Controllers

      post '/system/shutdown' do
          # byebug
        system.shutdown(params[:form]).to_json
      end

    end
  end
end
