class V0

  def system
    @system ||=
      Api::Models::System.new(
        session[:system_ip],
        settings,
        current_user.system_api_token )
  end

  def set_app(app_name)
    @app = system.app app_name
  end

  def set_service(service_name)
    @service = system.service service_name
  end

end
