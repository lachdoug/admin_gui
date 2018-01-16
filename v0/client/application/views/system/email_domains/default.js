cell({

	id: 'systemEmailDomainsDefault',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System email default domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email_domains",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[email_domain]",
										label: "Domain",
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/email_domains/default",
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
