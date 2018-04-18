class V0

  get '/' do
    content_type :html
    erb :'index.html'
  end

  get '/client' do
    content_type :'application/javascript'
    erb :'client.js'
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

end
