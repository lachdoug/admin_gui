cell({

	id: "systemEmailDomainsNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email_domains/new",
						render: function(response) {
							return form({
								components: [
									formField( {
										type: response.domains.length ? "select_with_input" : "string",
										name: "data[email_domain]",
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
								action: '/system/email_domains',
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
