cell({

	id: "systemUnavailable",

	_live: function ( opts={} ) {
		modal._live(
			{
				header: icon({icon: "fa fa-window-close", text: "System unavailable"}),
				body: {
					$components: [
						{
							id: "systemUnavailableMessage",
							$init: function () {
								this._updateMessage ( opts.message );
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
							200: function(response) {
								modal._kill();
								alert("System ready.");
								location.reload();
							},
							// 401: function(response) {
							// 	alert("Failed to authenticate.");
							// 	main._renderSignedOut();
							// },
							502: function(response) {
								systemUnavailable._handlePollingResponseFailure(response.error.message);
							},
							503: function(response) {
								systemBusy._live(response.error);
							},
						}
					});
				}, 1000 );
			} else {
				main._renderDisconnectedSystem();
			};
		}, 9000 );
	},

	_handlePollingResponseFailure: function( message ) {
		// check if modal still open, if not then don't poll
		if (typeof systemUnavailableMessage !== 'undefined') {
			systemUnavailableMessage._updateMessage( message );
			systemUnavailable._pollServer();
		} else {
			main._renderDisconnectedSystem();
		};
	},


});
