cell({

	id: 'systemUserEmailDistributionGroupRemove',

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
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "distribution_group_name_and_email_address",
										label: "Distribution group",
										collectionIncludeBlank: true,
										value: "",
										collection: data.email.distribution_groups.map(function(distribution_group){
											return data.mailbox == distribution_group.email_address ?
											[
												distribution_group.name + ":" + distribution_group.email_address,
												distribution_group.name
											] :
											[
												distribution_group.name + ":" + distribution_group.email_address,
												distribution_group.name + " (alias " + distribution_group.email_address + ")"
											];
										}),
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/distribution_groups/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
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
