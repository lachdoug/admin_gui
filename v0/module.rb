require 'sinatra/base'
require 'sinatra/extension'
require 'sinatra/json'
require "sinatra/streaming"

require 'tempfile'
require 'rest-client'
# require 'pry'
require 'byebug' if Sinatra::Base.development?
require 'yaml'

# Asset management for client app
# require 'sprockets'
# require 'sinatra/sprockets-helpers'

class V0 < Sinatra::Base

  ## For debugging
  ##----------------------------------------------------------------------------

  before do

    if Sinatra::Base.development?
      puts 'Request'
      puts request.path_info
      puts params.inspect
    end
  end



  ##############################################################################
  ## Settings
  ##############################################################################

  set dump_errors: Sinatra::Base.development?
  set public_folder: 'public'
  set data_directory_path: 'data/v0'
  set system_api_url: ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL']
  set kerberos_server: ENV['ENGINES_ADMIN_GUI_KERBEROS_SERVER']
  set kerberos_keytab_path: ENV['ENGINES_ADMIN_GUI_KERBEROS_KEYTAB_PATH']
  set remote_management: Sinatra::Base.development? || ENV['ENGINES_ADMIN_GUI_REMOTE_MANAGEMENT'] || false
  set show_services: ENV['ENGINES_ADMIN_GUI_SHOW_SERVICES_BY_DEFAULT'] || false
  set show_software_titles: ENV['ENGINES_ADMIN_GUI_SHOW_SOFTWARE_TITLES_BY_DEFAULT'] || false
  set show_container_memory_usage: ENV['ENGINES_ADMIN_GUI_SHOW_CONTAINER_MEMORY_USAGE_BY_DEFAULT'] || false
  set session_secret: ENV['ENGINES_ADMIN_GUI_SESSION_SECRET'] || '0'
  set user_inactivity_timeout: ( ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] || 30 ).to_i * 60
  set library_url: ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] || "https://library.engines.org/api/v0/apps"
  set bug_reports_url: ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] || 'http://127.0.0.1:3666/v0/bugs'
  set banner_text: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] || nil
  set banner_text_color: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] || '#fff'
  set banner_background_color: ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] || '#48d'
  set enable_client_event_streaming: true || !Sinatra::Base.development?

  # before do
  #   session[:system_api_url] = session[:system_api_url] || settings.system_api_url
  #   session[:remote_management] = settings.remote_management
  # end

  ##############################################################################
  ## CLIENT
  ##############################################################################

  # Here are the erb files
  set :views, Proc.new { File.join(root, "client") }

  get '/' do
    content_type :html
    erb :'index.html'
  end

  get '/client' do
    # byebug
    content_type :'application/javascript'
    erb :'client.js'
  end

  put '/client/select_system' do
    halt 404 unless settings.remote_management
    session[:system_api_url] = params[:data][:system_api_url]
    # :system_selection is an index (of which system to select from settings)
    { system_api_url: session[:system_api_url] }.to_json
  end

  patch '/client/display_settings' do
    # byebug
    unless params[:show_services].nil?
      session[:show_services] = ( params[:show_services] == 'true' )
    end
    unless params[:show_software_titles].nil?
      session[:show_software_titles] = ( params[:show_software_titles] == 'true' )
    end
    unless params[:show_container_memory_usage].nil?
      session[:show_container_memory_usage] = ( params[:show_container_memory_usage] == 'true' )
    end
    # :system_selection is an index (of which system to select from settings)
    {}.to_json
  end

  post '/test_kerberos' do

    require 'kerberos_authenticator'
    require 'net/ldap'

    server = settings.kerberos_server
    keytab_path = "/tmp/krb5cc_22050" # settings.kerberos_keytab_path
    username = params[:data][:username]
    password = params[:data][:password]

    out = {
      server: server,
      keytab_path: keytab_path,
      username: username,
      password: password
    }

    KerberosAuthenticator.setup do |config|
      config.server = settings.kerberos_server
      config.keytab_path = settings.kerberos_keytab_path
    end

    begin
      user = KerberosAuthenticator.authenticate!(username, password)
      out[:result] = "Successful authentication! #{user.inspect}".to_json
    rescue KerberosAuthenticator::Error => e
      out[:result] = "Failed to authenticate! #{e.inspect}".to_json
    end

    ldap = Net::LDAP.new
ldap.host = '127.0.0.1'
ldap.port = 389
# ldap.auth "joe_user", "opensesame"
if ldap.bind
  out[:ldap] = "bind ok"
else
  out[:ldap] = "bind failed"
end

    out.to_json

  end

  ##############################################################################
  ## Errors
  ##############################################################################

  class NonFatalError < StandardError;
    def initialize(message, status_code=500)
      @message = message
      @status_code = status_code
    end
    attr_reader :status_code, :message
  end


  ##############################################################################
  ## API
  ##############################################################################

  ## Load-up the controllers, models & services
  ##----------------------------------------------------------------------------

  require_relative 'api/api'
  # include Api
  # include Models
  register Api::Controllers

  ## Helpers
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
  ## 503 Non-fatal: System busy or unavailable

  set show_exceptions: false
  error do |error|
    if error.is_a?(NonFatalError)
      [ error.status_code, { error: { message: error.message } }.to_json ]
    elsif error.is_a?(RestClient::Exceptions::ReadTimeout)
      [ 405, { error: { message: "The connection to the Engines system has timed-out." } }.to_json ]
    else
      error_text = error.class.to_s + " (" + error.message + ")"
      begin
      # if error.respond_to?(:response) && error.response.respond_to?(:net_http_res) && !error.response.net_http_res.body.empty?
        system_error = JSON.parse( error.response.net_http_res.body, symbolize_names: true )
        error_text += "\n\n" + system_error[:error_object][:error_mesg].to_s
      rescue
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

  # ## CORS
  # ##----------------------------------------------------------------------------
  #
  # before do
  #   headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
  #   headers['Access-Control-Allow-Origin'] = '*'
  #   headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  #   headers['Access-Control-Expose-Headers'] = 'Content-Disposition, Content-Type'
  # end
  #
  # options "*" do
  #   response.headers["Allow"] = "HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS"
  #   response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
  #   status 200
  # end

  ## Authenticate
  ##----------------------------------------------------------------------------

  enable :sessions

  before do
    raise NonFatalError.new('Not signed in.', 401) unless
      no_auth || current_user
  end

  def no_auth
    request.path_info == '/' ||
    request.path_info == '/test_kerberos' ||
    request.path_info == '/system/signin' ||
    request.path_info == '/system/container_events' ||
    request.path_info == '/system/statistics/container_memory' ||
    request.path_info == '/client' ||
    request.path_info == '/client/select_system'
    #  ||
    # request.path_info == '/client/display_settings'
  end

  def system_api_token
    current_user.system_api_token if current_user
  end

  def system_api_url
    session[:system_api_url] || settings.system_api_url
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
    @current_user = user if user.authenticated?(opts)
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

  # def selected_system_api_url
  #   session[:system_api_url] || settings.system_api_url
  # end

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


end
