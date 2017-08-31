var $systemUnavailable = {

	$cell: true,
	id: "systemUnavailable",


	_live: function (message) {
		debugger;

		modal._live(
			{
				header: icon({icon: "fa fa-window-close", text: "System unavailable"}),
				body: {
					$components: [
						{
							id: "systemUnavailableMessage",
							$components: [ message || { $type: "p", $text: "Trying to connect to system." } ],
							_updateMessage: function ( message ) {
								this.$components = [ message ];
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
						systemUnavailable._pollServer();
					},
					500: function() {
						systemUnavailable._pollServer();
					},
					503: function(response) {
						systemUnavailableMessage._updateMessage( { $type: "p", $text: response.error.message } );
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
