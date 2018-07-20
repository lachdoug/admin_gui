cell({

	id: "systemSystemUserPassword",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-lock", text: "System user password" } ),
				body: {
					$components: [
						systemSystemUserPassword._form()
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
					name: "system_user[current_password]",
					label: "Current password",
					required: true,
				} ),
				formField( {
					type: "password_with_confirmation",
					name: "system_user[new_password]",
					label: "New password",
					required: true,
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/system_user/password",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					alert(
						"You will be redirected to the system sign in page.\n\n" +
						"Please sign in using the new password."
					);
					location.reload();
				},
			}
		});

	},

});
