cell({

	id: "systemEmailDomainsDelete",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System delete email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "name",
										label: "Email domain",
										collection: data.domains,
										required: true,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/domains/',
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
