cell({

	id: 'systemDistributionListEmailAddressDelete',

	_live: function (distribution_list_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution list remove email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: distribution_list_name },
					}),
					hr(),
					dataLoader({
						action: "/system/email/distribution_list",
						params: {
							distribution_list_name: distribution_list_name
						},
						params: {
							distribution_list_name: distribution_list_name
						},
						render: function(data) {

							return form({
								components: [
									formField({
										type: "hidden",
										name: "distribution_list_name",
										value: distribution_list_name
									}),
									formField( {
										type: "select",
										name: "email_address",
										label: "Email address",
										value: "",
										collectionIncludeBlank: true,
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemEmailDistributionList._live(distribution_list_name) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/email/distribution_list/email_address",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemEmailDistributionList._live(distribution_list_name);
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
