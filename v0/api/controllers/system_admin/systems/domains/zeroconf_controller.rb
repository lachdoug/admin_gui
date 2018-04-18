class V0
  module Api
    module Controllers

      put "/system/domains/zeroconf" do
        system.enable_zeroconf.to_json
      end

      delete "/system/domains/zeroconf" do
        system.disable_zeroconf.to_json
      end

    end
  end
end
