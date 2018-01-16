cell({

	id: "systemEmailDomainsDelete",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System delete email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email_domains/delete",
						render: function(response) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "data[email_domain]",
										label: "Email domain",
										collection: response,
										required: true,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/system/email_domains/email_domain/',
								method: 'DELETE',
								callbacks: {
									200: systemEmail._live,
								}
							})
						}
					})
				],
			},
		});
	},


});
