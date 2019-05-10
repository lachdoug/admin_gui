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
  ##----------------------------------------------------------------------------

  if Sinatra::Base.development?
    ## Randomly select gui mode: remote or local
    # if [true, false].sample
    #   ENV['ENGINES_ADMIN_GUI_REMOTE_MANAGEMENT'] = 'true'
    # else
      ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] = "172.16.162.129"
    # end
    before do
      puts "Request #{request.request_method} #{request.path_info} #{params.inspect}"
    end
  end

  ## Default content type to JSON
  ##----------------------------------------------------------------------------

  before do
    content_type :json
  end

  ## Load module files
  ##----------------------------------------------------------------------------

  Dir.glob( [ "#{root}/module/**/*.rb" ] ).map do |file|
    require file
  end

  ## Register controllers and helpers
  ##----------------------------------------------------------------------------

  require_relative 'api/api'
  register Api::Controllers
  helpers Api::Helpers

  ## Enable sessions and streaming
  ##----------------------------------------------------------------------------

  enable :sessions
  helpers Sinatra::Streaming

end
