class V0
  module Api
    module Controllers

      get '/apps/:app_name/blueprint' do
        set_app(params[:app_name])
        @app.blueprint.to_json
      end

    end
  end
end
