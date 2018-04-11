var $systemRestartBaseOS = {

	$cell: true,
	id: "systemRestartBaseOS",

	_live: function() {
		var baseOSName = system._$data.properties.version.base_os.name;
		modal._live(
			{
				header: icon( { icon: "fa fa-power-off", text: "System restart " + baseOSName } ),
				body: {
					$components: [
						{ $type: "p", $text: "Restart " + baseOSName + "? This will reboot the system." },
						systemRestartBaseOS._form(),
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
			action: "/system/restart_base_os",
			method: 'GET',
			callbacks: {
				200: function(response) {
					setTimeout( function () {
						main._renderBusySystem( { behavior: "base_os_restart" } );
					}.bind( this ), 1000 );

				},
			}
		});

	},


};
