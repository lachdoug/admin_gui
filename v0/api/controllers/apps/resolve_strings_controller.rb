class V0
  module Api
    module Controllers

      get '/apps/:app_name/resolve_strings' do
        set_app(params[:app_name])
        # byebug
        @app.resolve_strings(params[:strings]).to_json
      end

    end
  end
end
