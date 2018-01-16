cell({
	id: "systemEmailAddresses",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System email addresses" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					// button( {
					// 	onclick: systemUsersNew._live,
					// 	icon: "fa fa-plus",
					// 	text: "Add"
					// } ),
					hr(),
					dataLoader({
						action: "/system/email_addresses",
						render: function(data) {
							return {
								$components: data.map( function( email_address ) {
									return button({
										text: email_address,
										onclick: function() { systemEmailAddressesEmailAddress._live(email_address) },
									});
								}),
							};
						}
					}),
				]
			}
		} );

	}

});
