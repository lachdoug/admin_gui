Engines Admin GUI
=================

This application provides an interface for administering an Engines system.

Framework
---------
Sinatra (module style, with config.ru)

Needs
-----
public directory: public  
persistent volume: data  
Note: does not need a DB and does not send mail.

Environment
-----------

ENV['ENGINES_ADMIN_GUI_SESSION_SECRET'] optional (sinatra will randomly generate if not provided)
ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] for example: "192.168.1.117".
ENV['ENGINES_ADMIN_GUI_REMOTE_MANAGEMENT'] default is false. When set to true the user can change :system_ip at runtime (and also enables stop and pause instructions on control service menu). If false ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] is **Required**.  
ENV['ENGINES_ADMIN_GUI_SHOW_SERVICES_BY_DEFAULT'] default is false
ENV['ENGINES_ADMIN_GUI_SHOW_SOFTWARE_TITLES_BY_DEFAULT'] default is false
ENV['ENGINES_ADMIN_GUI_SHOW_CONTAINER_MEMORY_USAGE_BY_DEFAULT'] default is false
ENV['ENGINES_ADMIN_GUI_USER_INACTIVITY_TIMEOUT'] default is 30 (i.e. 30 minutes).  
ENV['ENGINES_ADMIN_GUI_LIBRARY_URL'] default is "https://library.engines.org/api/v0/apps"  
ENV['ENGINES_ADMIN_GUI_BUG_REPORTS_URL'] for example: "https://127.0.0.1:3666".  
NO LONGER USED: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT'] default is nil.  
NO LONGER USED: ENV['ENGINES_ADMIN_GUI_BANNER_TEXT_COLOR'] default is '#fff'.  
NO LONGER USED: ENV['ENGINES_ADMIN_GUI_BANNER_BACKGROUND_COLOR'] default is '#48d'.  
DEPRECATED:  ENV['ENGINES_ADMIN_GUI_SYSTEM_API_URL'] > use ENV['ENGINES_ADMIN_GUI_SYSTEM_IP'] instead



{
  :status=>"start",
  :id=>"8ffd250339620d75248239417978e6394eb1636e53378f37da4e100a8ed8e555",
  :from=>"nodered",
  :Type=>"container",
  :Action=>"start",
  :Actor=>{
    :ID=>"8ffd250339620d75248239417978e6394eb1636e53378f37da4e100a8ed8e555",
    :Attributes=>{
      :container_name=>"nodered",
      :container_type=>"app",
      :image=>"nodered",
      :name=>"nodered"
    }
  },
  :time=>1560486936,
  :timeNano=>1560486936549895016,
  :container_name=>"nodered",
  :container_type=>"app",
  :state=>"running"
}


{
  :status=>"uninstalling",
  :id=>-1,
  :from=>"phpmyadmin",
  :Type=>"container",
  :Action=>"uninstalling",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"phpmyadmin",
      :container_type=>"app"
    }
  }
}

{
  :status=>"uninstalled",
  :id=>-1,
  :from=>"phpmyadmin",
  :Type=>"container",
  :Action=>"uninstall",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"phpmyadmin",
      :container_type=>"app"
    }
  }
}

{
  :status=>"failed",
  :id=>-1,
  :from=>"phpmyadmin",
  :Type=>"container",
  :Action=>"uninstall",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"phpmyadmin",
      :container_type=>"app"
    }
  }
}


{
  :status=>"installing",
  :id=>-1,
  :from=>"name_of_new_engine",
  :Type=>"container",
  :Action=>"install",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"name_of_new_engine",
      :container_type=>"app"
    }
  }
}

{
  :status=>"installed",
  :id=>-1,
  :from=>"name_of_new_engine",
  :Type=>"container",
  :Action=>"install",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"name_of_new_engine",
      :container_type=>"app"
   }
 }
}

{
  :status=>"failed",
  :id=>-1,
  :from=>"name_of_new_engine",
  :Type=>"container",
  :Action=>"install",
  :Actor=>{
    :ID=>"system",
    :Attributes=>{
      :container_name=>"name_of_new_engine",
      :container_type=>"app"
   }
 }
}


{
  "status":"installing",
  "id":-1,
  "from":"anodered2",
  "Type":"container",
  "Action":"install",
  "Actor":{
    "ID":"system",
    "Attributes":{
      "container_name":"anodered2",
      "container_type":"app"
    }
  },
  "state":"installing",
  "container_name":"anodered2",
  "container_type":"app"
}

{
  "status":"installed",
  "id":-1,
  "from":"anodered2",
  "Type":"container",
  "Action":"install",
  "Actor":{
    "ID":"system",
    "Attributes":{
      "container_name":"anodered2",
      "container_type":"app"
    }
  },
  "state":"installed",
  "container_name":"anodered2",
  "container_type":"app"
}


{
  "status":"OS updating",
  "id":"system",
  "from":"system",
  "Type":"container",
  "Action":"update",
  "state":"updating",
  "container_name":"system",
  "container_type":"system_service"
}

{
  "status":"OS restarting",
  "id":"system",
  "from":"system",
  "Type":"container",
  "Action":"restart",
  "state":"restarting"
}




Todo
----
Subservices
Clear OOM
Export/import
Install blueprint merge via route
Install form reserved names and reinstalling deleted app
