cell({

	id: "systemUserUserGroups",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user user groups" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
						up: function() { systemUsersUser._live(user_uid) }
					}),
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							return {
								$components: [
									{
										class: "clearfix",
										$components: [
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserUserGroupsAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserUserGroupsRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.groups.length == 0 ?
												[ { $type: "i", $text: "No groups." } ] :
												data.groups.map( function( group ) {
													return { $type: "li", $text: group };
												})
											},
										]
									},
								]
							};

						},
					})

				]
			}
		} );
	},

});
