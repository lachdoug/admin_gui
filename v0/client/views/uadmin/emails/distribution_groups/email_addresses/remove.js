cell({

	id: 'systemDistributionGroupEmailAddressDelete',

	_live: function (distribution_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group remove email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: distribution_group_name },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/distribution_groups/",
						params: {
							name: distribution_group_name
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
										type: "select",
										name: "address",
										label: "Email address",
										value: "",
										collectionIncludeBlank: true,
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemEmailDistributionGroup._live(distribution_group_name) } } ),
									formSubmit(),
								],
								action: "/uadmin/email/distribution_groups/email_addresses/",
								method: "DELETE",
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
