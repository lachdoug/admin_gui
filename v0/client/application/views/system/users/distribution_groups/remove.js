cell({

	id: 'systemUserDistributionGroupRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user remove email distribution group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/user/" + user_uid + "/distribution_groups/remove",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "[distribution_group_email_address]",
										label: "Distribution group",
										collectionIncludeBlank: true,
										value: "",
										collection: data.distribution_groups.map(function(distribution_group){
											return data.mailbox == distribution_group.email_address ?
											[
												distribution_group.distribution_group + ":" + distribution_group.email_address,
												distribution_group.distribution_group
											] :
											[
												distribution_group.distribution_group + ":" + distribution_group.email_address,
												distribution_group.distribution_group + " (alias " + distribution_group.email_address + ")"
											];
										}),
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/user/" + user_uid + "/distribution_group",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
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
