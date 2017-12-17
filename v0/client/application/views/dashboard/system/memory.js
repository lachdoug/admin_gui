cell({

  id: "systemMemory",

  _live: function() { this._polling(); },

  _polling: function () {
    this._close();
    if (system._$showContainerMemoryUsage) {
      apiRequest({
        action: '/system/statistics/container_memory',
        callbacks: {
          200: function(response) {
            if (system._$showContainerMemoryUsage) {
              systemMemory._handler(response);
              systemMemory._pollContainerMemoryTimeout = setTimeout( function() {
                systemMemory._polling();
              }, 7000)
            };
          },
        }
      });
    };
  },

  _close: function () {
    clearTimeout( systemMemory._pollContainerMemoryTimeout );
  },


  _handler: function( data ) {
    if ( "systemApps" in window ) { systemApps._refreshMemory(data.containers.applications) };
    if ( "systemServices" in window ) { systemServices._refreshMemory(data.containers.services) };
    // console.log(data.containers);
    //   this._data.services.map(
    //     function( service ) {
    //       var memory = data.containers.services[service.name];
    //       if (memory) {
    //         return $.extend( service, { memory_current: memory.current, memory_max: memory.maximum, memory_limit: memory.limit } );
    //       } else {
    //         return $.extend( service, { memory_current: 0, memory_max: 0, memory_limit: 0 } );
    //       };
    //     }
    //   );
    //   this._data.apps.map(
    //     function( app ) {
    //       var memory = data.containers.applications[app.name];
    //       if (memory) {
    //         return $.extend( app, { memory_current: memory.current, memory_max: memory.maximum, memory_limit: memory.limit } );
    //       } else {
    //         return $.extend( app, { memory_current: 0, memory_max: 0, memory_limit: 0 } );
    //       };
    //     }
    //   );
  },

});
