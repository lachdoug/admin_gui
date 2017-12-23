cell({

	id: "systemUserGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemUserManagement._live,
					}),
					// hr(),
					dataLoader({
						action: "/system/users/groups",
						render: function(data) {
							return {
								$components: data.map( function( group ) {
									return button({
										text: group.name,
										onclick: function() { systemUsersGroup._live(group) },
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
