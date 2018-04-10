cell({

	id: 'systemDistributionGroupEmailAddressesAdd',

	_live: function (distribution_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group add email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: distribution_group_name },
					}),
					hr(),
					dataLoader({
						action: "/system/email/distribution_groups/email_addresses/new",
						params: {
							distribution_group_name: distribution_group_name
						},
						render: function(data) {

							return form({
								components: [
									formField({
										type: "hidden",
										name: "distribution_group_name",
										value: distribution_group_name
									}),
									formField( {
										type: "select_with_input",
										name: "email_address[address]",
										label: "Email address",
										// value: nil,
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemEmailDistributionGroup._live(distribution_group_name) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/email/distribution_groups/email_addresses/",
								method: "POST",
								callbacks: {
									200: function(response) {
										systemEmailDistributionGroup._live(distribution_group_name);
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});
