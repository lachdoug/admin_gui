class V0
  module Api
    module Controllers

      get '/apps/:app_name/websites' do
        set_app(params[:app_name])
        @app.websites.to_json
      end

    end
  end
end
