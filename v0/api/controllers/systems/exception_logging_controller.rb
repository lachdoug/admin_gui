class V0
  module Api
    module Controllers

      # get '/system/locale' do
      #   system.remote_exception_logging.to_json
      # end

      put "/system/exception_reporting" do
        system.enable_exception_reporting.to_json
      end

      delete "/system/exception_reporting" do
        system.disable_exception_reporting.to_json
      end

    end
  end
end
