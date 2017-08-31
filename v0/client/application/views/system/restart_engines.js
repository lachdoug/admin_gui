var $systemRestartEngines = {

	$cell: true,
	id: "systemRestartEngines",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-play-circle", text: "Restart Engines" } ),
				body: {
					$components: [
						{ $type: "p", $text: "Restart Engines?" },
						{
							class: "clearfix",
							$components: [
								button( { icon: "fa fa-times", text: "Cancel", wrapperClass: "pull-left", onclick: "$$('#systemMenu')._live();"} ),
								button( { icon: "fa fa-check", text: "OK", wrapperClass: "pull-right", onclick: "$$('#systemRestartEngines')._restart();"} ),
							]
						}
					]
				}
			}
		);
	},


	_restart: function () {
		apiRequest( {
			action: "/system/restart_engines",
			callbacks: {
				200: function() {
					systemUnavailable._live( { $type: "p", $text: "Engines restart has been initiated." } );
				}
			}
		} );
	}

};
