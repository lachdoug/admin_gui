cell({

	id: 'systemEmailSetupEmailDomain',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System setup email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/default_domain/new",
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "default_domain[name]",
										label: "Domain",
                    value: data.default,
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
								],
								action: "/system/email/default_domain",
								method: "POST",
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
