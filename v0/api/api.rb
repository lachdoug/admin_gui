class V0
  module Api

    class NonFatalError < StandardError;
      def initialize(message, status_code=500)
        @message = message
        @status_code = status_code
      end
      attr_reader :status_code, :message
    end

    module Lib
      Dir.glob( [ "./v0/api/lib/**/*.rb" ] ).each { |file| require file }
    end
    include Lib

    module Models
      Dir.glob( [ "./v0/api/models/**/*.rb" ] ).each { |file| require file }
    end

    module Services
      Dir.glob( [ "./v0/api/services/**/*.rb" ] ).each { |file| require file }
    end

    module Controllers
      
      include Models
      include Services
      extend Sinatra::Extension
      Dir.glob( [ "./v0/api/controllers/**/*.rb" ] ).each { |file| require file }
    end

  end
end
