cell({

	id: 'systemUserEmailDistributionGroupAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System user add email distribution group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/users/email/distribution_groups/new",
						params: { user_uid: user_uid },
						render: function(data) {
							// var distribution_groups = data.map(function(distribution_group){
							// 	return distribution_group.name
							// })
							return data.distribution_groups.length ? form({
								components: [
									formField( {
										type: "select",
										name: "distribution_group[name]",
										label: "Distribution group",
										value: "",
										collectionIncludeBlank: true,
										collection: data.distribution_groups,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
											pp( data )
								],
								action: "/system/users/email/distribution_groups/",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
									},
								}
							}) : { $components: [
								{ $type: "i", $text: "No distribution groups to add." },
								button({
									wrapperClass: "pull-right",
									text: "OK",
									icon: "fa fa-check",
									onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) }
								})
							] };

						}
					}),
				]
			}
		} );
	},

});
