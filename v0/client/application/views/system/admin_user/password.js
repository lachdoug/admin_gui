cell({

	id: "systemPassword",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-lock", text: "System password" } ),
				body: {
					$components: [
						systemPassword._form()
					]
				}
			}
		);
	},

	_form: function () {
		return form ( {
			components: [
				formField( {
					type: "password",
					name: "data[current_password]",
					// id: "systemPasswordField_current_password",
					label: "Current password",
					required: true,
				} ),
				// formField( {
				// 	type: "hidden",
				// 	name: "data[username]",
				// 	value: "admin",
				// } ),
				formField( {
					type: "password_with_confirmation",
					name: "data[new_password]",
					// id: "systemPasswordField_new_password",
					label: "New password",
					required: true,
				} ),
				formCancel ( { onclick: "systemControlPanel._live();" } ),
				formSubmit(),
			],
			action: "/system/user/admin",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					alert(
						"You will be redirected to the sign in page. " +
						"Please sign in again using your new password.\n\n" +
						"If your browser has asked to update your password, " +
						"you can accept this first, then click OK."
					);
					location.reload();
				},
			}
		});

	},

});
