cell({

	id: "systemEmailDistributionListEdit",

	_live: function (distribution_list_name) {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System edit email distribution list" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/distribution_list/edit",
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
										name: "data[local_part]",
										label: "Local part (before the @)",
										value: data.local_part,
									} ),
									formField( {
										type: "select",
										name: "data[domain]",
										label: "Domain",
										value: data.domain,
										collection: data.domains,
									} ),
									formField( {
										type: "text",
										name: "data[description]",
										label: "Description",
										value: data.description,
									} ),
									formCancel ( {
										onclick: function () {
											systemEmailDistributionList._live(distribution_list_name)
										},
									} ),
									formSubmit(),
								],
								action: '/system/email/distribution_list',
								method: 'PUT',
								callbacks: {
									200: function (data) {
										systemEmailDistributionList._live(data.name);
									},
								}
							})
						}
					}),
				],
			},
		});
	},


});
