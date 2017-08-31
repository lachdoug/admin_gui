class V0
  module Api
    module Lib

      class NonFatalError < StandardError;
        def initialize(message, status_code=500)
          @message = message
          @status_code = status_code
        end
        attr_reader :status_code, :message
      end

    end
  end
end
