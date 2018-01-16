cell({

	id: 'systemEmailSetupEmailDomain',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System setup email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email_domains/setup",
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "data[email_domain]",
										label: "Domain",
                    value: data.select,
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
											pp( data )
								],
								action: "/system/email_domains/setup",
								method: "PUT",
								callbacks: {
									200: systemEmail._live,
								}
							});

						}
					}),
				]
			}
		} );
	},

});
