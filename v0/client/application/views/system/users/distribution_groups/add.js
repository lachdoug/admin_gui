cell({

	id: 'systemUserDistributionGroupAdd',

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
						action: "/system/user/" + user_uid + "/distribution_groups/new",
						render: function(data) {

							return data.distribution_groups.length ? form({
								components: [
									formField( {
										type: "select",
										name: "distribution_group",
										label: "Distribution group",
										value: "",
										collectionIncludeBlank: true,
										collection: data.distribution_groups,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/user/" + user_uid + "/distribution_groups",
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
									},
								}
							}) : { $components: [
								{ $type: "i", $text: "No distribution groups to add." },
								button({
									wrapperClass: "pull-right",
									text: "OK",
									icon: "fa fa-check",
									onclick: function() { systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) }
								})
							] };

						}
					}),
				]
			}
		} );
	},

});
