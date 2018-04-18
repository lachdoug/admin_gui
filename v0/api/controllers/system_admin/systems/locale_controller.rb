class V0
  module Api
    module Controllers

      get '/system/locale' do
        system.locale.to_json
      end

      put "/system/locale" do
        system.update_locale(params[:data]).to_json
      end

    end
  end
end
