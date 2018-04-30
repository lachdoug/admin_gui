cell({

	id: "systemUserGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemUsers._live,
					}),
					dataLoader({
						action: "/uadmin/users/groups",
						render: function(data) {
							return {
								$components: data.map( function( group ) {
									var group_path =  group.dn.replace(",ou=Groups,dc=engines,dc=internal", '').replace("cn=", '').replace(/,ou=/g, "/");
									var label = (
										group.name === group_path ?
										group.name :
										( group.name + " (" + group_path + ")" )
									);
									// debugger;
									return button({
										text: label,
										onclick: function() { systemUserGroup._live(group) },
									});
								}),
							};
						}
					}),
				]
			}
		} );

	},


});
