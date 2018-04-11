class V0
  module Api
    module Controllers

      get '/system/orphan_data' do
        system.orphan_data.to_json
      end

      delete "/system/orphan_data/:orphan_id" do
        system.delete_orphan(params[:orphan_id]).to_json
      end

    end
  end
end
