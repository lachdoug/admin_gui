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
							$components: [ { $type: "p", $text: message || "Trying to connect to system." } ],
							_updateMessage: function ( message ) {
								this.$components = [ { $type: "p", $text: message } ];
							},
						},
						{
							$type: "p",
							$text: "Please wait."
						},
						// remoteManagement ? form( {
						// 	components: [
						// 		formField( { name: "data[system_api_url]", value: '', label: 'System API URL', type: 'hidden' } ),
						// 		formSubmit({ icon: "fa fa-times", text: "Reset" })
						// 	],
						// 	action: "/system/select",
				    //   method: "PUT",
						// 	callbacks: {
						// 		200: function ( response ) {
				    //       location.reload();
						// 		}
						// 	}
						// } ) : {}
					]
				}
			}
		);
		this._pollServer();
		$("#pageLoadingSpinner").fadeIn();
		system._kill();

	},


	_pollServer: function () {
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
						systemUnavailable._handlePollingResponseFailure(response.error.message);
					},
					200: function(response) {
						alert("System connected.");
						location.reload();
					}
				}
			});
		}, 5000 );
	},

	_handlePollingResponseFailure: function( message) {
		if (typeof systemUnavailableMessage !== 'undefined') {
			if ( message ) {
				systemUnavailableMessage._updateMessage( message );
			};
			systemUnavailable._pollServer();
		} else {
			system._showDisconnectedSystem();
			$("#pageLoadingSpinner").fadeOut();
		};
	},


};
