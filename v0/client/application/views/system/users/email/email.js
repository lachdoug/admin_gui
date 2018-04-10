cell({

	id: "systemUserEmail",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user email" } ),
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
						action: "/system/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							return {
								$init: function() {
									if ( opts.scrollTo ) {
										document.getElementById(opts.scrollTo).scrollIntoView();
									}
								},
								$components: [
									{
										$components: [
											dataList( {
												class: "dl-horizontal",
												items: [
													{ label: "Mailbox", data: data.email.mailbox }
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
															systemUserEmailMailboxEdit._live(user_uid);
														}
													}),
													button({
														wrapperClass: "pull-left",
														icon: "fa fa-times",
														text: "Disable",
														onclick: function() {
															(
																data.email.aliases.length ||
																data.email.distribution_groups.length
															) ?
															alert("All email aliases and distribution groups must be removed before mailbox can be disabled.") :
															apiRequest({
																action: "/system/users/accounts/email",
																params: { user_uid: user_uid },
																method: "DELETE",
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
											legend ( { text: "Aliases", id: "systemUserEmailAliasesArea" } ),
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserEmailAliasesAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserEmailAliasesRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.email.aliases.map( function( emailAlias ) {
													return { $type: "li", $text: emailAlias };
												})
											},
											{ $type: "br" },
											legend ( { text: "Distribution groups", id: "systemUserEmailDistributionGroupsArea" } ),
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserEmailDistributionGroupAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserEmailDistributionGroupRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.email.distribution_groups.map( function( distribution_group ) {
													return distribution_group.email_address == data.email.mailbox ?
														{ $type: "li", $text: distribution_group.name } :
														{ $type: "li", $text: distribution_group.name + " (alias " + distribution_group.email_address + ")" };
												})
											},
											{ $type: "br" },
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
