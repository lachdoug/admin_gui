var $systemShutdown = {

	$cell: true,
	id: "systemShutdown",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-plug", text: "System shutdown" } ),
				body: {
					$components: [
						{
							id: "systemShutdownForm",
							$components: [
								{
									type: "p",
									style: "color: red;",
								 	$components: [
										icon( {
											icon: "fa fa-warning",
											text: "The system will shutdown. You will need to manually restart." } )
									]
								},
								systemShutdown._form()
							],
						}
					]
				}
			}
		);
	},


	_form: function () {
		return form ( {
			components: [
				formField( {
					type: "text",
					name: "data[reason]",
					id: "systemShutdownField_shutdown",
					label: "Reason",
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/shutdown",
			callbacks: {
				200: function(response) {
					main._renderDisconnectedSystem();
				},
			}
		});

	},

};
