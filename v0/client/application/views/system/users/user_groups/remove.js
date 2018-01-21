cell({

	id: 'systemUsersUserGroupsRemove',

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
						action: "/system/users/user/" + user_uid + "/groups/delete",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[group_name]",
										label: "Group",
										collection: data.current_groups,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user_uid + "/groups/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid);
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
