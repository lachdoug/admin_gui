cell({
	id: "systemUserGroup",

	_live: function (user_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user group" } ),
			body: {
				$components: [
					modalNav({
						up: systemUserGroups._live,
						content: { $type: "h4", $text: user_group_name }
					}),
					hr(),
					dataLoader({
						action: "/system/user_group",
						params: {
							user_group_name: user_group_name
						},
						render: function(data) {
							return ( data.users.length > 0 ) ? {
								$type: "ul",
								class: "list",
								style: "list-style: none; margin-left: -30px;",
								$components: data.users.map( function( user_uid ) {
									return button({
										text: user_uid,
										onclick: function() { systemUserUserGroups._live(user_uid) },
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
