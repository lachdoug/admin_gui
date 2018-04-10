cell({

	id: "systemEmailDomainsNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/domains/new",
						render: function(response) {
							return form({
								components: [
									formField( {
										type: response.domains.length ? "select_with_input" : "string",
										name: "domain[name]",
										label: "Email domain",
										value: response.domains.length ? response.domains[0] : null,
										collection: response.domains,
										required: true,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/system/email/domains/',
								method: 'POST',
								callbacks: {
									200: systemEmail._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});
