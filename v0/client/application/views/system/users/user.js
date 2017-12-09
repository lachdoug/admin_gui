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
							systemUsersUser._load(user.id)
						},
						_refresh: function ( data ) {
							this.$components = [
								dataList({ items: [
									{ label: "User ID", data: data.id }
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
											onclick: function() { systemUsersUserGroupAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUsersUserGroupRemove._live(user) },
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
											onclick: function() { systemUsersUserEmailAddressAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUsersUserEmailAddressRemove._live(user) },
										}),
									]
								},
								{ $type: "br" },
								legend ( { text: "Email groups" } ),
								{
									$type: "ul",
									$components: data.email_groups.map( function( emailGroup ) {
										return { $type: "li", $text: emailGroup };
									})
								},
								{
									class: "clearfix",
									$components: [
										button({
											icon: "fa fa-plus-square-o",
											text: "Add",
											class: "btn pull-left",
											onclick: function() { systemUsersUserEmailGroupAdd._live(user) },
										}),
										button({
											icon: "fa fa-minus-square-o",
											text: "Remove",
											class: "btn pull-right",
											onclick: function() { systemUsersUserEmailGroupRemove._live(user) },
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

	_load: function (userId) {

		apiRequest({
			action: "/system/users/user/" + userId,
			callbacks: {
				200: function(response) {
					systemUsersUserContent._refresh(response);
				},
			}
		});

	},

};
