var $systemUsersUser = {

	$cell: true,
	id: "systemUsersUser",


	_live: function (user) {

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
							{ $type: "h4", $text: user.name },
						]
					},
					{ $type: "hr" },
					{
						id: "systemUsersUserContent",
						$components: [
							icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
						],
						$init: function() {
							// debugger
							systemUsersUser._load(user.uid)
						},
						_refresh: function ( data ) {
							this.$components = [
								dataList({ items: [
									{ label: "UID", data: data.uid }
								]}),
								{ $type: "br" },
								legend ( { text: "Groups" } ),
								{
									$type: "ul",
									$components: data.groups.map( function( group ) {
										return { $type: "li", $text: group };
									})
								},
								{
									class: "clearfix",
									$components: [
										button({
											icon: "fa fa-plus-square-o",
											text: "Add",
											class: "btn pull-left",
											onclick: function() { systemUsersUserGroupsAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUsersUserGroupsRemove._live(user) },
										}),
									]
								},
								{ $type: "br" },
								legend ( { text: "Email addresses" } ),
								{
									$type: "ul",
									$components: data.email_addresses.map( function( emailAddress ) {
										return { $type: "li", $text: emailAddress };
									})
								},
								{
									class: "clearfix",
									$components: [
										button({
											icon: "fa fa-plus-square-o",
											text: "Add",
											class: "btn pull-left",
											onclick: function() { systemUsersEmailAddressesAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUserEmailAddressRemove._live(user) },
										}),
									]
								},
								{ $type: "br" },
								legend ( { text: "Distribution lists" } ),
								{
									$type: "ul",
									$components: data.distribution_lists.map( function( list ) {
										return { $type: "li", $text: list };
									})
								},
								{
									class: "clearfix",
									$components: [
										button({
											icon: "fa fa-plus-square-o",
											text: "Add",
											class: "btn pull-left",
											onclick: function() { systemUsersEmailGroupAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUsersEmailGroupRemove._live(user) },
										}),
									]
								}

							];
						},
					},
				]
			}
		} );
	},

	_load: function (userUid) {

		apiRequest({
			action: "/system/users/user/" + userUid,
			callbacks: {
				200: function(response) {
					systemUsersUserContent._refresh(response);
				},
			}
		});

	},

};
