function renderSystemServices() {

  return {
    id: "systemServices",
    _$data: [],
    _$memoryData: {},
    $titleData: {},

    $init: function() {
  		this._load()
    },

    _load: function() {
      apiRequest({
  			action: 'system/containers/services',
        callbacks: {
          200: function(data) {
            systemServices._refresh(data);
            data.forEach( function(service) {
              if ( "serviceMenu" in window ) {
                serviceMenu._handleContainerEvent( {
                  container_type: 'service',
                  container_name: service.name,
                  status: service
                } )
              };
            })
          },
        },
      });
    },

    _refresh: function(data) {
      this._$data = data;
    },

    $update: function() {

      var memoryData = this._$memoryData || {};

      this.$components = [
        hr(),
        {
        	class: "system-containers",
        	$components: this._$data.map( function(service) {
            var serviceMemoryData = memoryData[service.name] || null;
        		return renderSystemService(service, serviceMemoryData);
        	} )
        },
      ];

    },

    _refreshMemory: function( data ) {
      this._$memoryData = data;
    },

    _handleEvent: function( event ) {
      ( this._$data || [] ).map(
        function( service ) {
          if ( service.name == event.container_name ) {
            return $.extend( service, event.status );
          } else {
            return service;
          };
        }
      );
    },

    _dataFor: function( serviceName ) {
  		return this._$data.find( function( serviceData ) {
  			return serviceData.name == serviceName
  		} );
    },

    _titleFor: function (serviceName) {
  		var cachedTitle = systemServices.$titleData[serviceName];

  		if ( typeof cachedTitle == 'undefined' ) {
        apiRequest({
  				action: "/services/" + serviceName + "/about",
  				callbacks: {
  					200: function( data ) {
              window["systemServiceTitle" + serviceName]._refresh( data.title );
  						systemServices.$titleData[serviceName] = data.title || "";
  					},
  				}
  			});
  			return null;
  		} else {
        return cachedTitle;
  		};

  	},

  };

};
