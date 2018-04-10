cell({

	id: "systemEmailDistributionGroupEdit",

	_live: function (distribution_group_name) {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System edit email distribution group" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/email/distribution_groups/edit",
						params: {
							name: distribution_group_name
						},
						render: function(data) {
							return form({
								components: [
									formField({
										type: "hidden",
										name: "name",
										value: distribution_group_name
									}),
									formField( {
										name: "distribution_group[local_part]",
										id: "email_distribution_group_local_part_field",
										label: "Local part (before the @)",
										value: data.local_part,
									} ),
									formField( {
										type: "select",
										name: "distribution_group[domain]",
										id: "email_distribution_group_domain_field",
										label: "Domain",
										value: data.domain,
										collection: data.email_domains,
									} ),
									formField( {
										type: "text",
										name: "distribution_group[description]",
										label: "Description",
										value: data.description,
									} ),
									formCancel ( {
										onclick: function () {
											systemEmailDistributionGroup._live(distribution_group_name)
										},
									} ),
									formSubmit(),
								],
								action: '/system/email/distribution_groups/',
								method: 'PUT',
								callbacks: {
									200: function (data) {
										var new_name = $("#email_distribution_group_local_part_field").val() + '@' + $("#email_distribution_group_domain_field").val();;
										systemEmailDistributionGroup._live(new_name);
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
