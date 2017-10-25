require 'sinatra/base'
require 'sinatra/extension'
require 'sinatra/json'
require "sinatra/streaming"

require 'tempfile'
require 'rest-client'
# require 'pry'
require 'byebug'
require 'yaml'

# Asset management for client app
# require 'sprockets'
# require 'sinatra/sprockets-helpers'

class V0 < Sinatra::Base

  ##############################################################################
  ## Settings
  ##############################################################################

  set public_folder: 'public'
  set data_directory_path: 'data/v0'

  set session_secret: ENV['ENGINES_ADMIN_GUI_SESSION_SECRET'] || '0'
  set user_inactivity_timeout: ( ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] || 30 ).to_i * 60
  set system_api_url: ( ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'] || 'https://192.168.1.117:2380' )
  set library_url: ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] || "https://library.engines.org/api/v0/apps"
  set bug_reports_url: ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] || 'https://127.0.0.1:3666'
  set banner_text: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] || nil
  set banner_text_color: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] || '#fff'
  set banner_background_color: ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] || '#48d'
  set enable_client_event_streaming: false #true #!Sinatra::Base.development?


  ##############################################################################
  ## CLIENT
  ##############################################################################

  set :views, Proc.new { File.join(root, "client") }

  get '/' do
    content_type :html
    # @server_url = settings.gui_api_url
    erb :index
  end

  get '/client' do
    content_type :'application/javascript'
    erb :client
  end

  ##############################################################################
  ## API
  ##############################################################################

  ## Load-up the controllers, models & services
  ##----------------------------------------------------------------------------

  require_relative 'api/api'
  include Api
  include Models
  register Controllers

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
  ## 503 Non-fatal: System busy or unavailable

  set show_exceptions: false
  error do |error|

    if error.is_a?(NonFatalError)
      [ error.status_code, { error: { message: error.message } }.to_json ]
    else

      error_text = error.class.to_s + " (" + error.message + ")"
      if error.respond_to?(:response) && error.response.respond_to?(:net_http_res)
        system_error = JSON.parse( error.response.net_http_res.body, symbolize_names: true )
        error_text += "\n\n" + system_error[:error_object][:error_mesg].to_s

      end
      [ 500, { error: { message: "Server error.",
        detail: {
          application: "Admin GUI ApiV0 v0.5",
          type: :Server500,
          text: error_text,
          method: request.request_method,
          path: request.fullpath,
          backtrace: error.backtrace,
          system_error: system_error
      } } }.to_json ]
    end
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

  ## CORS
  ##----------------------------------------------------------------------------

  before do
    headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
    headers['Access-Control-Expose-Headers'] = 'Content-Disposition, Content-Type'
    content_type :json
  end

  options "*" do
    response.headers["Allow"] = "HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
    status 200
  end

  ## Authenticate
  ##----------------------------------------------------------------------------

  enable :sessions

  def system_api_token
    current_user.system_api_token if current_user
  end

  def user_tracking_id
    session[:tracking]["HTTP_USER_AGENT"]
  end

  def current_user
    return @current_user if @current_user
    user = User.new user_tracking_id, settings
    @current_user = user if user.authenticated?
  end

  ## Set core resources
  ##----------------------------------------------------------------------------

  def system(opts={})
    @system ||=
      System.new(
        settings.system_api_url,
        opts[:without_token] ? nil : system_api_token,
        settings )
  end

  # def libraries
  #   @libraries ||=
  #     ApiV0::Libraries.all
  # end

  def set_app(app_name)
    @app = system.app app_name
  end

  def set_service(service_name)
    @service = system.service service_name
  end

  ## For debugging
  ##----------------------------------------------------------------------------

  before '*' do

    if Sinatra::Base.development?
      puts 'Params'
      puts params.to_yaml

      # puts 'Routes'
      # Sinatra::Application::V0.routes.each { |route_k, route_v| puts "#{route_k} #{route_v}" }

    end
  end

end
