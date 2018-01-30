cell({

	id: "systemBusy",

	_live: function ( opts={} ) {

		var message;
		switch(opts.behavior) {
    case "engines_update":
			message = "Engines update in progress.\n\nThis normally takes a minute or two, but can take longer in some cases.\n\nPlease wait.";
      break;
		case "engines_restart":
      message = "Engines is restarting.";
      break;
		case "base_os_update":
			message = "Base OS update in progress.\n\nThis normally takes a minute or two, but can take longer in some cases.\n\nPlease wait.";
		  break;
		case "base_os_restart":
			message = "Base OS is restarting.\n\nThis normally takes a few minutes.\n\nPlease wait.";
		  break;
		}

		modal._live(
			{
				header: {
					$type: "span",
					$components: [
						hourglass(),
						{ $type: "span", $text: " System busy" }
					]
				},  // icon({icon: "fa fa-exchange", text: "System busy"}),
				body: {
					$components: [
						{
							id: "systemBusyMessage",
							$type: "p",
							style: "white-space: pre-wrap;",
							$text: message
						}
					]
				}
			}
		);
		this._pollServer();
	},

	_pollServer: function () {
		$("#pageLoadingSpinner").fadeIn();
		setTimeout( function() {
			if (typeof systemBusyMessage !== 'undefined') {
				setTimeout( function() {
					apiRequest({
						action: "/system",
						callbacks: {
							0: function() { systemBusy._pollServer(); },
							502: function() { systemBusy._pollServer(); },
							503: function() { systemBusy._pollServer(); },
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

});
