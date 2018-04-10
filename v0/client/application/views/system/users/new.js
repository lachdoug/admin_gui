cell({

	id: "systemUsersNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new user" } ),
			body: {
				$components: [
					form({
						components: [
							{
								class: "row",
								$components: [
									formField( {
										name: "account[first_name]",
										required: true,
										label: "First name",
										wrapperClass: "col-sm-6",
									} ),
									formField( {
										name: "account[last_name]",
										required: true,
										label: "Last name",
										wrapperClass: "col-sm-6",
									} ),
								]
							},
							formField( {
								name: "account[uid]",
								label: "UID (username)",
								required: true,
							} ),
							formField( {
								type: "password_with_confirmation",
								name: "account[password]",
								label: "Password",
								required: true,
							} ),
							formCancel ( {
								onclick: function () {
									systemUsers._live();
								}
							} ),
							formSubmit(),
						],
						action: '/system/users/accounts/',
						method: 'POST',
						callbacks: {
							200: function(response) {
								systemUsersUser._live(response.uid);
							},
						}
					}),
				],
			},
		});
	},


});
