class V0
  module Api
    module Controllers

      get '/apps/:app_name/instruct' do
        set_app(params[:app_name])
        @app.instruct(params[:instruction]).to_json
      end

    end
  end
end
