cell({

	id: "systemEmailDistributionListNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new email distribution list" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/distribution_lists/new",
						render: function(data) {
							return form({
								components: [
									formField( {
										name: "data[distribution_list][local_part]",
										label: "Local part (before the @)",
									} ),
									formField( {
										type: "select",
										name: "data[distribution_list][domain]",
										label: "Domain",
										value: data.default,
										collection: data.domains,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/system/email/distribution_lists',
								method: 'POST',
								callbacks: {
									200: systemEmail._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});
