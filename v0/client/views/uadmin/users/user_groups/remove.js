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

							var collection = data.groups.map(function(group){
								var group_path =  group.dn.replace(",ou=Groups,dc=engines,dc=internal", '').replace("cn=", '').replace(/,ou=/g, "/");
								var label = (
									group.name === group_path ?
									group.name :
									( group.name + " (" + group_path + ")" )
								);
								return [ group.dn, label ];
							});

							return form({
								components: [
									formField( {
										type: "checkboxes",
										name: "group_dns",
										label: "Group",
										collection: collection,
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
