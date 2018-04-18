class V0

  class NonFatalError < StandardError;
    def initialize(message, status_code=500, opts={})
      @message = message
      @status_code = status_code
      @behavior = opts[:behavior]
    end
    attr_reader :status_code, :message, :behavior
  end

  ## Error handling
  ##----------------------------------------------------------------------------

  ## 400 Fatal: General client error
  ## 401 Non-fatal: Authentication failed
  ## 404 Fatal: Bad route
  ## 405 Non-fatal: Action not allowed (route is recognised, but action cannot be performed)
  ## 406 Fatal: Params not acceptable (route is recognised, but params incomplete or invalid)
  ## 500 Fatal: General server error
  ## 502 Non-fatal: System unavailable
  ## 503 Non-fatal: System busy

  set show_exceptions: false
  error do |error|
    if error.is_a?(NonFatalError)
      [ error.status_code, { error: { message: error.message, behavior: error.behavior } }.to_json ]
    else
      error_text = error.class.to_s + " (" + error.message + ")"
      if error.respond_to?(:response) && error.response.respond_to?(:net_http_res) && !error.response.net_http_res.body.empty?
        response = JSON.parse(error.response.net_http_res.body, symbolize_names: true)
        system_error = response[:error_object] || response[:error]
        system_error_message = system_error[:error_mesg] || system_error[:message]
        error_text += "\n\n#{system_error_message}"
      end
      [ 500, { error: { message: "Server error.",
        detail: {
          application: "Admin GUI ApiV0 v0.5",
          type: :Server500,
          text: error_text,
          method: request.request_method,
          path: request.fullpath,
          backtrace: error.backtrace,
          system_error: obscure_system_error_params( system_error )
      } } }.to_json ]
    end
  end

  def obscure_system_error_params( system_error )
    # TODO: hide param values, say by turning "Hi" into "String 2"
    system_error
  end

  not_found do
    { error: { message: "Error.", detail: {
      application: "Admin GUI ApiV0 v0.5",
      type: :Server404,
      text: "#{request.fullpath} not found",
      method: request.request_method,
      path: request.fullpath,
      } } }.to_json
  end

end
