cell({

	id: 'systemUsersUserGroupsRemove',

	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System remove user from group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user.name },
					}),
					hr(),
					dataLoader({
						action: "/system/users/user/" + user.uid + "/remove_group",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[group_name]",
										label: "Group",
										collection: data.current_groups,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user.uid + "/groups/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user);
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
