class V0
  module Api
    module Controllers

      get '/system/label' do
        system.label.to_json
      end

      put "/system/label" do
        system.update_label(params[:label]).to_json
      end

    end
  end
end
