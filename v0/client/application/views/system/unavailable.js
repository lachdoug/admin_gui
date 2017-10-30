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
						}
					]
				}
			}
		);
		// this._pollServer();
		$("#pageLoadingSpinner").fadeIn();
		system._kill();

	},


	_pollServer: function () {

		setTimeout( function() {
			apiRequest({
				action: "/system",
				callbacks: {
					0: function() {
						systemUnavailable._pollServer();
					},
					500: function() {
						systemUnavailable._pollServer();
					},
					503: function(response) {
						if (typeof systemUnavailableMessage !== 'undefined') {
							systemUnavailable._live( response.error.message );
						};
						systemUnavailable._pollServer();
					},
					200: function(response) {
						alert("System connected.");
						location.reload();
					}
				}
			});
		}, 5000 );
	},


};
