var $systemRestartEngines = {

	$cell: true,
	id: "systemRestartEngines",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-play-circle", text: "System restart Engines" } ),
				body: {
					$components: [
						{ $type: "p", $text: "Restart Engines?" },
						systemRestartEngines._form(),
						// {
						// 	class: "clearfix",
						// 	$components: [
						// 		button( { icon: "fa fa-times", text: "Cancel", wrapperClass: "pull-left", onclick: systemMenu._live } ),
						// 		button( { icon: "fa fa-check", text: "OK", wrapperClass: "pull-right", onclick: systemRestartEngines._restart } ),
						// 	]
						// }
					]
				}
			}
		);
	},

	_form: function () {

		return form ( {
			components: [
				formCancel ( { onclick: systemMenu._live } ),
				formSubmit(),
			],
			action: "/system/restart_engines",
			method: 'GET',
			callbacks: {
				200: function(response) {
					main._renderUnavailableSystem( { message: "Engines restart has been initiated.", behavior: "engines_restart" } );
				},
			}
		});

	},



	// _restart: function () {
	// 	apiRequest( {
	// 		action: "/system/restart_engines",
	// 		callbacks: {
	// 			200: function() {
	// 				main._renderUnavailableSystem( "Engines restart has been initiated." );
	// 			}
	// 		}
	// 	} );
	// }

};
