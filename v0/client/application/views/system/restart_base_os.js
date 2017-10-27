var $systemRestartBaseOS = {

	$cell: true,
	id: "systemRestartBaseOS",

	_live: function() {
		var baseOSName = system._data.properties.version.base_os.name;
		modal._live(
			{
				header: icon( { icon: "fa fa-power-off", text: "Restart " + baseOSName } ),
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
					systemUnavailable._live( "Base OS restart has been initiated." );
				},
			}
		});

	},

	//
	// _restart: function () {
	// 	apiRequest({
	// 		action: "/system/restart_base_os",
	// 		callbacks: {
	// 			200: function() {
	// 				systemUnavailable._live( "Base OS restart has been initiated." );
	// 			}
	// 		}
	// 	});
	// }

};
