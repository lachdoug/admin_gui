cell({

	id: 'systemUserUserGroupsRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System remove user from group" } ),
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
										type: "select_multiple",
										name: "names",
										label: "Group",
										collection: data.groups,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/groups",
								params: { user_uid: user_uid },
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserUserGroups._live(user_uid);
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
