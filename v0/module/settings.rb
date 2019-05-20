class V0

  set dump_errors: true # Sinatra::Base.development?
  set public_folder: 'public'
  set data_directory_path: 'data/v0'
  set system_ip: ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] || ( ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'] ? ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'][8..-6] : nil )
  set session_secret: ENV['ENGINES_ADMIN_GUI_SESSION_SECRET'] || '0'
  set remote_management: ENV['ENGINES_ADMIN_GUI_REMOTE_MANAGEMENT'] || false
  set show_services: ENV['ENGINES_ADMIN_GUI_SHOW_SERVICES_BY_DEFAULT'] || false
  set show_software_titles: ENV['ENGINES_ADMIN_GUI_SHOW_SOFTWARE_TITLES_BY_DEFAULT'] || false
  set show_container_memory_usage: ENV['ENGINES_ADMIN_GUI_SHOW_CONTAINER_MEMORY_USAGE_BY_DEFAULT'] || false
  set user_inactivity_timeout: ( ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] || 30 ).to_f * 60
  set library_url: ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] || "https://library.engines.org/api/v0/apps"
  set bug_reports_url: ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] || 'http://127.0.0.1:3666/v0/bugs'
  # set banner_text: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] || nil
  # set banner_text_color: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] || '#fff'
  # set banner_background_color: ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] || '#48d'
  set enable_client_event_streaming: true
  set server_settings: { timeout: 120 }

end
