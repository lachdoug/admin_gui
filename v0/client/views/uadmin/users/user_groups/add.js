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
						action: "/uadmin/users/accounts/groups/new",
						params: { user_uid: user_uid },
						render: function(data) {



							var collection = data.groups.map(function(group){
								var group_path =  group.dn.replace(",ou=Groups,dc=engines,dc=internal", '').replace("cn=", '').replace(/,ou=/g, "/");
								var label = (
									group.name === group_path ?
									group.name :
									( group.name + " (" + group_path + ")" )
								);
								return [ group.dn, label ];
							});

							return data.groups.length ? form({
								components: [
									formField( {
										type: "checkboxes",
										name: "groups[dns]",
										label: "Group",
										collection: collection,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/groups",
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
