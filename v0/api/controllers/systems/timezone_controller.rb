class V0
  module Api
    module Controllers

      get '/system/timezone' do
        system.timezone.to_json
      end

      put "/system/timezone" do
        system.update_timezone(params[:form]).to_json
      end

    end
  end
end
