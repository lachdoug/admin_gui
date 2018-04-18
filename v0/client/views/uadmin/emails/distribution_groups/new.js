cell({

	id: "systemEmailDistributionGroupNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System new email distribution group" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {
							return form({
								components: [
									formField( {
										name: "distribution_group[local_part]",
										label: "Local part (before the @)",
									} ),
									formField( {
										type: "select",
										name: "distribution_group[domain]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formField( {
										type: "text",
										name: "distribution_group[description]",
										label: "Description",
									} ),
									formCancel ( {
										onclick: systemEmailDistributionGroups._live,
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/distribution_groups/',
								method: 'POST',
								callbacks: {
									200: systemEmailDistributionGroups._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});
