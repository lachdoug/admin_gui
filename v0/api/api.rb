class V0

  # Dir.glob( [ "./v0/api/helpers/**/*.rb" ] ).each { |file| require file }
  # helpers Helpers


  module Api

    # class NonFatalError < StandardError;
    #   def initialize(message, status_code=500)
    #     @message = message
    #     @status_code = status_code
    #   end
    #   attr_reader :status_code, :message
    # end

    # module Lib
      # Dir.glob( [ "./v0/api/helpers/**/*.rb" ] ).each { |file| require file }
      # helpers Helpers
      # register Helpers

    # end
    # extend Lib


    # module Models
      Dir.glob( [ "./v0/api/models/**/*.rb" ] ).each { |file| require file }
    # end

    # module Services
      Dir.glob( [ "./v0/api/services/**/*.rb" ] ).each { |file| require file }
    # end

    Dir.glob( [ "./v0/api/helpers/**/*.rb" ] ).each { |file| require file }

    module Controllers
      include Models
      include Services
      extend Sinatra::Extension
      Dir.glob( [ "./v0/api/controllers/**/*.rb" ] ).each { |file| require file }
    end

  end
end
