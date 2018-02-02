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
						action: "/system/users/user/" + user_uid + "/groups/new",
						render: function(data) {

							return data.available_groups.length ? form({
								components: [
									formField( {
										type: "select",
										name: "data[group_name]",
										label: "Group",
										collection: data.available_groups,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user_uid + "/groups",
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
