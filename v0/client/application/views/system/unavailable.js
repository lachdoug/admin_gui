var $systemUnavailable = {

	$cell: true,
	id: "systemUnavailable",


	_live: function ( opts={} ) {
		systemUnavailable._opts = opts
		modal._live(
			{
				header: icon({icon: "fa fa-window-close", text: "System unavailable"}),
				body: {
					$components: [
						{
							id: "systemUnavailableMessage",
							$init: function () {
								this._updateMessage ( opts.message || "Failed to connect.\n\nPlease wait." )
							},
							_updateMessage: function ( message ) {
								this.$components = [ { $type: "p", style: "white-space: pre-wrap;", $text: message || "Failed to connect.\n\nPlease wait." } ];
							},
						},
					]
				}
			}
		);
		this._pollServer();
	},


	_pollServer: function () {
		$("#pageLoadingSpinner").fadeIn();
		setTimeout( function() {
			if (typeof systemUnavailableMessage !== 'undefined') {
				systemUnavailableMessage._updateMessage( "Checking system status..." );
				setTimeout( function() {
					apiRequest({
						action: "/system",
						callbacks: {
							0: function() {
								systemUnavailable._handlePollingResponseFailure();
							},
							500: function() {
								systemUnavailable._handlePollingResponseFailure();
							},
							503: function(response) {
								systemUnavailable._opts.behavior = response.error.behavior;
								systemUnavailable._handlePollingResponseFailure();
							},
							200: function(response) {
								modal._kill();
								alert("System ready.");
								location.reload();
							}
						}
					});
				}, 1000 );
			} else {
				main._renderDisconnectedSystem();
			};
		}, 9000 );
	},

	_handlePollingResponseFailure: function () {
		// check if modal still open, if not then don't poll
		if (typeof systemUnavailableMessage !== 'undefined') {
			var message;
			if ( systemUnavailable._opts.behavior == "engines_update" ) {
				message = "Engines update in progress.\n\nThe update process normally takes a minute or two, but can take longer in some cases."
			} else if ( systemUnavailable._opts.behaviour == "base_os_restart" ) {
				message = "Base OS is restarting."
			};
			systemUnavailableMessage._updateMessage( message );
			systemUnavailable._pollServer();
		} else {
			main._renderDisconnectedSystem();
		};
	},


};
