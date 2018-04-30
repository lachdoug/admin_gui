cell({
	id: "systemUserGroup",

	_live: function (group) {

		var group_path =  group.dn.replace(",ou=Groups,dc=engines,dc=internal", '').replace("cn=", '').replace(/,ou=/g, "/");
		var label = (
			group.name === group_path ?
			group.name :
			( group.name + " (" + group_path + ")" )
		);

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user group" } ),
			body: {
				$components: [
					modalNav({
						up: systemUserGroups._live,
						content: { $type: "h4", $text: label }
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/groups/",
						params: {
							dn: group.dn
						},
						render: function(data) {
							return ( data.members.length > 0 ) ? {
								$type: "ul",
								class: "list",
								style: "list-style: none; margin-left: -30px;",
								$components: data.members.map( function( user_uid ) {
									return button({
										text: user_uid,
										onclick: function() { systemUsersUser._live(user_uid) },
									});
								}),
							} : { $type: "i", $text: "This group has no members." };
						},
					}),
				]
			}
		} );

	}

});
