class V0

  before do
    no_auth? || authenticate_user
  end

  attr_reader :current_user

  def authenticate_user(opts={})
    user = Api::Models::User.new session, request, settings
    @current_user = user if user.authenticated?( opts )
  end

  def no_auth?
    [
      [ "GET", '/' ],
      [ "POST", '/system/signin' ],
      [ "GET", '/system/container_events' ],
      [ "GET", '/system/statistics/container_memory' ],
      [ "GET", '/client' ]
    ].include? [ request.request_method, request.path ]
  end

  def unauthenticated_system
    Api::Models::System.new( session[:system_ip], settings )
  end

end
