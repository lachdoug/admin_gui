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
					// hr(),
					dataLoader({
						action: "/system/users_groups",
						render: function(data) {
							return {
								$components: data.map( function( group ) {
									return button({
										text: group,
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
