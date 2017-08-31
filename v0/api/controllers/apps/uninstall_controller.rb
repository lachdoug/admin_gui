class V0
  module Api
    module Controllers

      post '/apps/:app_name/uninstall' do
        set_app(params[:app_name])
        @app.uninstall(delete_app_data: params[:form]).to_json
      end

    end
  end
end
