cell({

  id: "systemEvents",

  _live: function() { this._stream(); },

	_close: function () {

		if (this._eventSource) {
			this._eventSource.close();
			this._eventSource = null
		};

	},

	_isRunning: function () {
		return ( this._eventSource && ( this._eventSource.readyState != 2 ) )
	},

	_stream: function () {
		if ( !this._isRunning() ) {

			this._close();
			this._eventSource = new EventSource(
				'/system/container_events'
			);
			this._eventSource.onmessage = function(e) {
				var event = JSON.parse(e.data);
				console.log(event);
				systemEvents._handler( event );
			};
      this._eventSource.onerror = function(e) {
        debugger;
        alert("System events error.");
      };
		};
	},


	_handler: function( event ) {
		if ( event.container_type == "service" ) {
      if ( "serviceMenu" in window ) { serviceMenu._handleContainerEvent( event ) };
			if ( "systemServices" in window ) { systemServices._handleEvent( event ) };
		} else {
      if ( "appMenu" in window ) { appMenu._handleContainerEvent( event ) };
      if ( "systemApps" in window ) { systemApps._handleEvent( event ) };
		};
	},

});
