cell({

	id: "systemUsersUser",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
						up: systemUsers._live
					}),
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							var group_count = data.groups.length;
							var group_text = group_count == 0 ? "No groups" : group_count == 1 ? "1 group" : group_count + " groups";
							return {
								$init: function() {
									if ( opts.scrollTo ) {
										document.getElementById(opts.scrollTo).scrollIntoView();
									}
								},
								$components: [
									button({
										text: "Edit",
										icon: "fa fa-edit",
										wrapperClass: "pull-right",
										onclick: function () {
											systemUsersUserEdit._live(user_uid);
										}
									}),
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
													if ( data.email.mailbox ) {
														alert("Disable email first.");
													}	else if ( data.groups.length > 0 ) {
														alert("Remove all groups first.");
													} else {
														if ( confirm("Are you sure that you want to delete user '" + user_uid + "'?") ) {
															apiRequest({
																action: "/uadmin/users/accounts/",
																params: { uid: user_uid},
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
												text: "Password",
												icon: "fa fa-user-secret",
												wrapperClass: "pull-left",
												onclick: function () {
													systemUsersEditPassword._live(user_uid);
												}
											}),
										]
									},
									hr(),
									data.email.mailbox ? {
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: data.email.mailbox
											},
											button({
												class: "pull-right",
												icon: "fa fa-envelope",
												text: "Email",
												onclick: function() { systemUserEmail._live(user_uid); },
											})
										]
									} : {
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: "Email not enabled"
											},
											button({
												class: "pull-right",
												icon: "fa fa-envelope",
												text: "Enable email",
												onclick: function() {
													systemUserEnableEmail._live(user_uid);
												},
											}),
										]
									},
									hr(),
									{
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: group_text,
											},
											button({
												icon: "fa fa-users",
												class: "pull-right",
												text: "Groups",
												onclick: function() { systemUserUserGroups._live(user_uid); },
											}),
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
