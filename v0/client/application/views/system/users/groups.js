cell({

	id: "systemUsersGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-th-list", text: "System user groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemUsers._live,
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
