cell({

	id: 'systemEmailDomainsDefault',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System email default domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "default_domain[name]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
											// pp( data )
								],
								action: "/system/email/default_domain",
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
