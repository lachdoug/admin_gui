cell({
	id: "systemEmailAddressesEmailAddress",

	_live: function (email_address) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System email address" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmailAddresses._live,
						content: { $type: "h4", $text: email_address }
					}),
					hr(),
					dataLoader({
						action: "/system/email_addresses/email_address/",
						params: {
							email_address: email_address,
						},
					}),
				]
			}
		} );

	}

});
