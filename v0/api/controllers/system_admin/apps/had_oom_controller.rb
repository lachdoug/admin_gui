class V0
  module Api
    module Controllers

      delete '/apps/:app_name/had_oom' do
        set_app(params[:app_name])
        @app.clear_had_oom.to_json
      end

    end
  end
end
