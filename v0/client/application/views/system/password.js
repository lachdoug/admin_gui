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
					label: "Current password",
					required: true,
				} ),
				formField( {
					type: "password_with_confirmation",
					name: "data[new_password]",
					label: "New password",
					required: true,
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/user/admin",
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
