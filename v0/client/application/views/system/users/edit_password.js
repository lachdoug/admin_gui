cell({

	id: "systemUsersEditPassword",

	_live: function ( user_uid ) {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user edit password" } ),
			body: {
				$components: [
					form({
						components: [
							formField( {
								type: "password_with_confirmation",
								name: "password[new]",
								label: "Password",
								required: true,
							} ),
							formCancel ( {
								onclick: function () {
									systemUsersUser._live( user_uid );
								}
							} ),
							formSubmit(),
						],
						action: '/system/users/accounts/password',
						params: { user_uid: user_uid },
						method: 'PUT',
						callbacks: {
							200: function(response) {
								systemUsersUser._live( user_uid );
							},
						}
					}),
				],
			},
		});
	},


});
