cell({

	id: 'systemUserUserGroupsAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System add user to group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/users/accounts/groups/new",
						params: { user_uid: user_uid },
						render: function(data) {

							return data.groups.length ? form({
								components: [
									formField( {
										type: "checkboxes",
										name: "groups[names]",
										label: "Group",
										collection: data.groups,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/system/users/accounts/groups",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserUserGroups._live(user_uid);
									},
								}
							}) : { $components: [
								{ $type: "i", $text: "No groups to add." },
								button({
									wrapperClass: "pull-right",
									text: "OK",
									icon: "fa fa-check",
									onclick: function() { systemUserUserGroups._live(user_uid) }
								})
							] };

						}
					}),
				]
			}
		} );
	},

});
