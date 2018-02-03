cell({

	id: "systemUserUserGroups",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user user groups" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: function() { systemUsersUser._live(user_uid) },
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
							{ $type: "h4", $text: user_uid },
						]
					},
					{ $type: "hr" },
					dataLoader({
						action: "/system/users/user/" + user_uid + "/groups",
						render: function (data) {
							return true ? {
								// $init: function() {
								// 	if ( opts.scrollTo ) {
								// 		document.getElementById(opts.scrollTo).scrollIntoView();
								// 	}
								// },
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
												$components: data.map( function( group ) {
													return { $type: "li", $text: group };
												})
											},
										]
									},
								]
							} : {
								// $init: function() {
								// 	if ( opts.scrollTo ) {
								// 		document.getElementById(opts.scrollTo).scrollIntoView();
								// 	}
								// },
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
													// button({
													// 	icon: "fa fa-minus-square-o",
													// 	text: "Remove",
													// 	wrapperClass: "pull-right",
													// 	onclick: function() { systemUserUserGroupsRemove._live(user_uid) },
													// }),
												]
											},


											{
												$type: "table",
												class: "table",
												$components: [
													{
														$type: "tbody",
														$components: data.map( function( group ) {
															return {
																$type: "tr",
																$components: [
																	button({
																		wrapperClass: "pull-right",
																		icon: "fa fa-trash",
																		onclick: function () {
																			if (
																				confirm("Are you sure that you want to remove " + user_uid + " from " + group + " group?")
																			) {
																				apiRequest({
																					action: "/system/users/user/" + user_uid + "/groups/",
																					method: "DELETE",
																					data: { group_name: group },
																					callbacks: {
																						200: function(response) {
																							systemUserUserGroups._live(user_uid);
																						},
																					},
																				});
																			};

																		},
																	}),
																	button({
																		class: "pull-left",
																		text: group,
																		onclick: function() { systemUserGroup._live(group) },
																	}),
																],
															};
														} )
													},
												],
											},
										],
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
