class V0

  ## Dashboard display flags
  ##----------------------------------------------------------------------------

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

end
