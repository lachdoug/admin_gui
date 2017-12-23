cell({

	id: 'systemUsersUserGroupsNew',

	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System add user to group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user.name },
					}),
					hr(),
					dataLoader({
						action: "/system/users/groups",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[group_name]",
										label: "Add user to group",
										collection: data,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user.id + "/groups",
								method: "PUT",
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
