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
              }, 15000)
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
  },

});
