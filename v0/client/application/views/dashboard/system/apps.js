function renderSystemApps() {

  return {
    id: "systemApps",
    _$data: null,
    _$memoryData: {},
    $titleData: {},

    $init: function() {
      this._load();
    },

    _load: function() {
  		apiRequest({
  			action: 'system/containers/apps',
        callbacks: {
          200: function(data) {
            systemApps._refresh(data);
          },
        },
      });
    },

    _refresh: function(data) {
      this._$data = data;
    },

    _refreshMemory: function( data ) {
      this._$memoryData = data;
    },

    _handleEvent: function( event ) {
      ( this._$data || [] ).map(
        function( app ) {
          if ( app.name == event.container_name ) {
            return $.extend( app, event.status );
          } else {
            return app;
          };
        }
      );
    },

    $update: function() {

      var memoryData = this._$memoryData || {};

      this.$components = [
        this._$data ?
        this._$data.length ?
        {
        	class: "system-containers",
        	$components: this._$data.map( function(app) {
            var appMemory = memoryData[app.name] || null;
        		return renderSystemApp(app, appMemory);
        	} )
        } :
        {
        	class: 'text-center',
        	$components: [
        		{ $type: 'p', $html: 'To install an app click on <span style="color: #48D"><i class="fa fa-hdd-o"></i> System</span> then <span style="color: #48D"><i class="fa fa-plus"></i> Install app</span>.' },
        	]
        } :
        {},
      ];

    },

    _dataFor: function( appName ) {
  		return this._$data.find( function( appData ) {
  			return appData.name == appName
  		} );
    },

    _titleFor: function (appName) {

  		var cachedTitle = systemApps.$titleData[appName];

      if ( typeof cachedTitle == 'undefined' ) {
        // systemApps.$titleData[appName] = ""
        apiRequest({
  				action: "/apps/" + appName + "/about",
  				callbacks: {
  					200: function( data ) {
              var appTitle = data.software.display.label || data.software.display.title;
              window["systemAppTitle" + appName]._refresh( appTitle );
  						systemApps.$titleData[appName] = appTitle || "";
  					},
            401: function() {}, // remove this once api token not in file
  				}
  			});
  			return null;
  		} else {
        return cachedTitle;
  		};

  	},

  };

};
