class V0
  module Api
    module Controllers

      get '/apps/:app_name/processes' do
        set_app(params[:app_name])
        @app.processes.to_json
      end

    end
  end
end
