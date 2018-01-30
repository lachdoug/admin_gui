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
						// {
						// 	class: "clearfix",
						// 	$components: [
						// 		button( { icon: "fa fa-times", text: "Cancel", wrapperClass: "pull-left", onclick: systemMenu._live } ),
						// 		button( { icon: "fa fa-check", text: "OK", wrapperClass: "pull-right", onclick: systemRestartBaseOS._restart } ),
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
			action: "/system/restart_base_os",
			method: 'GET',
			callbacks: {
				200: function(response) {
					main._renderBusySystem( { behavior: "base_os_restart" } );
				},
			}
		});

	},


};
