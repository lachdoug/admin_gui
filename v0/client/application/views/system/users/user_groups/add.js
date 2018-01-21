cell({

	id: 'systemUsersUserGroupsAdd',

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
						action: "/system/users/user/" + user_uid + "/new_group",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[group_name]",
										label: "Group",
										collection: data.available_groups,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user_uid + "/groups",
								method: "POST",
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
