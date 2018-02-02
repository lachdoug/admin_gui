cell({

	id: "systemUsersUser",


	_live: function (user_uid, opts={}) {

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
								$init: function() {
									if ( opts.scrollTo ) {
										document.getElementById(opts.scrollTo).scrollIntoView();
									}
								},
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
													if ( data.email_enabled ) {
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
									hr(),
									button({
										icon: "fa fa-users",
										text: "Groups",
										onclick: function() { systemUserUserGroups._live(user_uid); },
									}),
									hr(),
									data.email_enabled ? button({
										icon: "fa fa-envelope",
										text: "Email",
										onclick: function() { systemUserEmail._live(user_uid); },
									}) : {
										class: "clearfix",
										$components: [
											button({
												wrapperClass: "pull-right",
												icon: "fa fa-envelope",
												text: "Enable email",
												onclick: function() {
													systemUserEnableEmail._live(user_uid);
												},
											}),
											{ $type: "i", $text: "Email not enabled." }
										]
									},
									hr(),
									data.signin_enabled ? button({
										icon: "fa fa-sign-in",
										text: "Sign-in",
										onclick: function() { systemUserEmail._live(user_uid); },
									}) : {
										class: "clearfix",
										$components: [
											button({
												wrapperClass: "pull-right",
												icon: "fa fa-sign-in",
												text: "Enable sign-in",
												onclick: function() {
													systemUserEnableSignin._live(user_uid);
												},
											}),
											{ $type: "i", $text: "Sign-in not enabled." }
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
