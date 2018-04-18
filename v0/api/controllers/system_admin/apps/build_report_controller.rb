class V0
  module Api
    module Controllers

      get '/apps/:app_name/build_report' do
        set_app(params[:app_name])
        @app.build_report.to_json
      end

    end
  end
end
