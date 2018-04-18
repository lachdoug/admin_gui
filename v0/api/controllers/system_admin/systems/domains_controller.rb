class V0
  module Api
    module Controllers

      get "/system/domains" do
        system.domains.to_json
      end

    end
  end
end
