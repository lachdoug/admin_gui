var $systemUnavailable = {

	$cell: true,
	id: "systemUnavailable",


	_live: function (message) {
		// debugger;

		modal._live(
			{
				header: icon({icon: "fa fa-window-close", text: "System unavailable"}),
				body: {
					$components: [
						{
							id: "systemUnavailableMessage",
							$init: function () {
								this._updateMessage ( message || "Failed to connect to system.\n\nPlease wait." )
							},
							_updateMessage: function ( message ) {
								console.log("message is: " + message);
								this.$components = [ { $type: "p", style: "white-space: pre-wrap;", $text: message || "Failed to connect to system.\n\nPlease wait." } ];
							},
						},
					]
				}
			}
		);
		this._pollServer();
		$("#pageLoadingSpinner").fadeIn();
		system._kill();
	},


	_pollServer: function () {
		console.log("start polling");
		setTimeout( function() {
			if (typeof systemUnavailableMessage !== 'undefined') {
				systemUnavailableMessage._updateMessage( "Trying again..." );
			};
			setTimeout( function() {
// var x = window.open('', '_blank', 'location=no,toolbar=0');
// x.document.body.innerHTML = 'get /system from systemUnavailable._pollServer';
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
							systemUnavailable._handlePollingResponseFailure(response.error.message);
						},
						200: function(response) {
							modal._kill();
							alert("System connected.");
							location.reload();
						}
					}
				});
			}, 1000 );
		}, 9000 );
	},

	_handlePollingResponseFailure: function( message) {
		// check if modal still open, if not then don't poll
		if (typeof systemUnavailableMessage !== 'undefined') {
			systemUnavailableMessage._updateMessage( message );
			systemUnavailable._pollServer();
		} else {
			main._renderDisconnectedSystem();
		};
	},


};
