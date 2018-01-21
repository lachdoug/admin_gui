var $systemUsersUser = {

	$cell: true,
	id: "systemUsersUser",


	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemUsers._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
							{ $type: "h4", $text: user_uid },
						]
					},
					{ $type: "hr" },
					dataLoader({
						action: "/system/users/user/" + user_uid,
						render: function (data) {
							return {
								$components: [
									dataList({ items: [
										{ label: "Name", data: data.name }
									]}),
									{
										class: "clearfix",
										$components: [
											button({
												text: "Delete",
												icon: "fa fa-trash-o",
												wrapperClass: "pull-right",
												onclick: function () {
													if ( data.email_user ) {
														alert("Disable email first.");
													}	else if ( data.groups.length > 0 ) {
														alert("Remove all groups first.");
													} else {
														if ( confirm("Are you sure that you want to delete user '" + user_uid + "'?") ) {
															apiRequest({
																action: "/system/users/user/" + user_uid,
																method: "DELETE",
																callbacks: {
																	200: function () {
																		systemUsers._live();
																	},
																}
															});
														};
													};
												}
											}),
											button({
												text: "Edit",
												icon: "fa fa-edit",
												wrapperClass: "pull-left",
												onclick: function () {
													systemUsersUserEdit._live(user_uid);
												}
											}),
										]
									},
									legend ( { text: "Groups" } ),
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
														onclick: function() { systemUsersUserGroupsAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUsersUserGroupsRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.groups.map( function( group ) {
													return { $type: "li", $text: group };
												})
											},
										]
									},
									{ $type: "br" },
									hr(),
									// pp(data),
									// data.email_not_setup ? {} : {
										// $components: [
											{ $type: "label", $text: "Email" },
											data.email_user ? {
												$components: [
													dataList( {
														class: "dl-horizontal",
														items: [
															{ label: "Mailbox", data: data.mailbox }
														]
													}),
													{
														class: "clearfix",
														$components: [
															button({
																wrapperClass: "pull-right",
																icon: "fa fa-edit",
																text: "Edit",
																onclick: function() {
																	systemUsersUserMailboxEdit._live(user_uid);
																}
															}),
															button({
																wrapperClass: "pull-left",
																icon: "fa fa-times",
																text: "Disable",
																onclick: function() {
																	(
																		data.email_aliases.length ||
																		data.distribution_lists.length
																	) ?
																	alert("All email aliases and distribution lists must be removed before mailbox can be disabled.") :
																	apiRequest({
																		action: "/system/users/user/" + user_uid + "/disable_email",
																		method: "PUT",
																		callbacks: {
																			200: function() {
																				systemUsersUser._live(user_uid);
																			}
																		}
																	})
																}
															}),
														]
													},
													legend ( { text: "Aliases" } ),
													{
														class: "clearfix",
														$components: [
															button({
																icon: "fa fa-plus-square-o",
																text: "Add",
																wrapperClass: "pull-left",
																onclick: function() { systemUsersEmailAddressesAdd._live(user_uid) },
															}),
															button({
																icon: "fa fa-minus-square-o",
																text: "Remove",
																wrapperClass: "pull-right",
																onclick: function() { systemUserEmailAddressRemove._live(user_uid) },
															}),
														]
													},
													{
														$type: "ul",
														$components: data.email_aliases.map( function( emailAlias ) {
															return { $type: "li", $text: emailAlias };
														})
													},
													{ $type: "br" },
													legend ( { text: "Distribution lists" } ),
													{
														class: "clearfix",
														$components: [
															button({
																icon: "fa fa-plus-square-o",
																text: "Add",
																wrapperClass: "pull-left",
																onclick: function() { systemUsersEmailGroupAdd._live(user_uid) },
															}),
															button({
																icon: "fa fa-minus-square-o",
																text: "Remove",
																wrapperClass: "pull-right",
																onclick: function() { systemUsersEmailGroupRemove._live(user_uid) },
															}),
														]
													},
													{
														$type: "ul",
														$components: data.distribution_lists.map( function( list ) {
															return { $type: "li", $text: list };
														})
													},
													{ $type: "br" },
												]
											} : button({
												icon: "fa fa-check",
												text: "Enable mailbox",
												onclick: function() {
													systemUsersUserEnableEmail._live(user_uid);
												},
											}),
									// 	]
									// }
								]
							};

						},
					})

					// {
					// 	id: "systemUsersUserContent",
					// 	$components: [
					// 		icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
					// 	],
					// 	$init: function() {
					// 		// debugger
					// 		systemUsersUser._load(user.uid)
					// 	},
					// 	_refresh: function ( data ) {
					// 		this.$components = [
					// 		];
					// 	},
					// },
				]
			}
		} );
	},

	// _load: function (userUid) {
	//
	// 	apiRequest({
	// 		action: "/system/users/user/" + userUid,
	// 		callbacks: {
	// 			200: function(response) {
	// 				systemUsersUserContent._refresh(response);
	// 			},
	// 		}
	// 	});
	//
	// },

};
