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
					main._renderBusySystem( { behavior: "engines_restart" } );
				},
			}
		});

	},

};
