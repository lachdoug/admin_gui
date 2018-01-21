cell({

	id: "systemEmailDistributionListNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System new email distribution list" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/distribution_lists/new",
						render: function(data) {
							return form({
								components: [
									formField( {
										name: "data[local_part]",
										label: "Local part (before the @)",
									} ),
									formField( {
										type: "select",
										name: "data[domain]",
										label: "Domain",
										value: data.default,
										collection: data.domains,
									} ),
									formField( {
										type: "text",
										name: "data[description]",
										label: "Description",
									} ),
									formCancel ( {
										onclick: systemEmailDistributionLists._live,
									} ),
									formSubmit(),
								],
								action: '/system/email/distribution_lists',
								method: 'POST',
								callbacks: {
									200: systemEmailDistributionLists._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});
