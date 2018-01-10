cell({

	id: "systemEmailDomainsNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new user" } ),
			body: {
				$components: [
					form({
						components: [
							formField( {
								name: "data[email_domain]",
								label: "Email domain",
								required: true,
							} ),
							formCancel ( {
								onclick: systemEmailDomains._live,
							} ),
							formSubmit(),
						],
						action: '/system/email_domains',
						method: 'POST',
						callbacks: {
							200: function(response) {
								systemEmailDomainsEmailDomain._live(response.email_domain);
							},
						}
					}),
				],
			},
		});
	},


});
