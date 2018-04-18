class V0
  module Api
    module Controllers

      put "/system/exception_reporting" do
        system.enable_exception_reporting.to_json
      end

      delete "/system/exception_reporting" do
        system.disable_exception_reporting.to_json
      end

    end
  end
end
