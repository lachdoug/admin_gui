require 'sinatra/base'
require 'sinatra/extension'
require 'sinatra/json'
require "sinatra/streaming"

require 'tempfile'
require 'rest-client'
require 'yaml'

require 'byebug' if Sinatra::Base.development?

class V0 < Sinatra::Base

  ## For debugging in development

  before do
    if Sinatra::Base.development?
      logger.info "Request #{request.request_method} #{request.path_info} #{params.inspect}"
    end
  end

  ##############################################################################
  ## Settings
  ##############################################################################

  if Sinatra::Base.development?
    ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] = "172.16.162.128"
  end

  set dump_errors: Sinatra::Base.development?
  set public_folder: 'public'
  set data_directory_path: 'data/v0'
  set system_ip: ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] || ( ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'] ? ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'][8..-6] : nil )
  set session_secret: ENV['ENGINES_ADMIN_GUI_SESSION_SECRET'] || '0'
  set remote_management: Sinatra::Base.development? || ENV['ENGINES_ADMIN_GUI_REMOTE_MANAGEMENT'] || false
  set show_services: ENV['ENGINES_ADMIN_GUI_SHOW_SERVICES_BY_DEFAULT'] || false
  set show_software_titles: ENV['ENGINES_ADMIN_GUI_SHOW_SOFTWARE_TITLES_BY_DEFAULT'] || false
  set show_container_memory_usage: ENV['ENGINES_ADMIN_GUI_SHOW_CONTAINER_MEMORY_USAGE_BY_DEFAULT'] || false
  set user_inactivity_timeout: ( ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] || 30 ).to_i * 60
  set library_url: ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] || "https://library.engines.org/api/v0/apps"
  set bug_reports_url: ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] || 'http://127.0.0.1:3666/v0/bugs'
  set banner_text: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] || nil
  set banner_text_color: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] || '#fff'
  set banner_background_color: ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] || '#48d'
  set enable_client_event_streaming: true

  ##############################################################################
  ## CLIENT
  ##############################################################################

  # Locate erb files
  set :views, Proc.new { File.join(root, "client") }

  get '/' do
    content_type :html
    erb :'index.html'
  end

  get '/application' do
    content_type :'application/javascript'
    erb :'application.js'
  end

  patch '/client/display_settings' do
    unless params[:show_services].nil?
      session[:show_services] = ( params[:show_services] == 'true' )
    end
    unless params[:show_software_titles].nil?
      session[:show_software_titles] = ( params[:show_software_titles] == 'true' )
    end
    unless params[:show_container_memory_usage].nil?
      session[:show_container_memory_usage] = ( params[:show_container_memory_usage] == 'true' )
    end
    {}.to_json
  end

  ##############################################################################
  ## Errors
  ##############################################################################

  class NonFatalError < StandardError;
    def initialize(message, status_code=500, opts={})
      @message = message
      @status_code = status_code
      @behavior = opts[:behavior]
    end
    attr_reader :status_code, :message, :behavior
  end

  ##############################################################################
  ## API
  ##############################################################################

  ## Register controllers
  ##----------------------------------------------------------------------------

  require_relative 'api/api'
  register Api::Controllers

  ## Register helpers
  ##----------------------------------------------------------------------------

  helpers Api::Helpers

  ## Enable streaming
  ##----------------------------------------------------------------------------

  helpers Sinatra::Streaming

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

  ## Default content type to JSON
  ##----------------------------------------------------------------------------

  before do
    content_type :json
  end

  ## Authenticate
  ##----------------------------------------------------------------------------

  enable :sessions

  before do
    raise NonFatalError.new('Not signed in.', 401) unless
      no_auth || current_user
  end

  def no_auth
    request.path_info == '/' ||
    request.path_info == '/system/signin' ||
    request.path_info == '/system/container_events' ||
    request.path_info == '/system/statistics/container_memory' ||
    request.path_info == '/application'
  end

  def system_api_token
    current_user.system_api_token if current_user
  end

  def system_ip
    settings.remote_management ? session[:system_ip] : settings.system_ip
  end

  def system_api_url
    "https://#{system_ip}:2380"
  end

  def show_software_titles
    session[:show_software_titles].nil? ?
    settings.show_software_titles :
    session[:show_software_titles]
  end

  def show_services
    session[:show_services].nil? ?
    settings.show_services :
    session[:show_services]
  end

  def show_container_memory_usage
    session[:show_container_memory_usage].nil? ?
    settings.show_container_memory_usage :
    session[:show_container_memory_usage]
  end


  def current_user(opts={})
    return @current_user if @current_user
    user = Api::Models::User.new session, settings
    @current_user = user if user.authenticated?( request.ip, opts)
  end

  ## Set core resources
  ##----------------------------------------------------------------------------

  def system(opts={})
    @system ||=
      Api::Models::System.new(
        system_api_url,
        opts[:without_token] ? nil : system_api_token,
        settings )
  end

  def set_app(app_name)
    @app = system.app app_name
  end

  def set_service(service_name)
    @service = system.service service_name
  end

end
