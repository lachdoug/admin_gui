Engines Admin GUI
=================

This application provides an interface for administering an Engines instance.

Framework
---------
Sinatra (module style, with config.ru)

Needs
-----
public directory: public  
persistent volume: data  
Note: does not need a DB and does not send mail.

config.ru
---------
require_relative 'v0/module'  
map('/') { run V0 }  

Environment
-----------
**Required**  
ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'] include port, for example: "https://192.168.1.117:2380"  
ENV['ENGINES_ADMIN_GUI_SESSION_SECRET']  
**Optional**  
ENV['ENGINES_ADMIN_GUI_SHOW_SERVICES_BY_DEFAULT'] default is false  
ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] default is 30 (i.e. 30 minutes)  
ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] default is "https://library.engines.org/api/v0/apps"  
ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] default is nil  
ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] default is '#fff'  
ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] default is '#48d'  
**Todo**  
i.e.: not working yet...  
ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] for example: "https://127.0.0.1:3666"  
