cell({

	id: "systemUsers",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System users" } ),
			body: {
				$components: [
					modalNav({
						up: systemControlPanel._live
					}),
					button( {
						wrapperClass: "pull-right",
						onclick: systemUserGroups._live,
						icon: "fa fa-users",
						text: "User groups"
					} ),
					button( {
						onclick: systemUsersNew._live,
						icon: "fa fa-plus",
						text: "New"
					} ),
					{ $type: "hr" },
					dataLoader({
						action: "/system/users/accounts",
						render: function(response) {
							return {
								$components: response.map( function(account) {
									return button({
										text: account.uid + " (" + account.name + ")",
										onclick: function() { systemUsersUser._live(account.uid) },
									});
								}),
							};
						},
					})

				]
			}
		} );
	},

});
