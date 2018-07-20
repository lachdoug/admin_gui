var $systemSystemUserEmail = {

	$cell: true,
	id: "systemSystemUserEmail",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-envelope", text: "System user email" } ),
				body: {
					$components: [
						{
							id: "systemSystemUserEmailForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemSystemUserEmail._form( data ) ];
							},
						}
					]
				}
			}
		);
		this._load();
	},

	_load: function () {
		apiRequest({
			action: "/system/system_user",
			callbacks: {
				200: function(response) {
					systemSystemUserEmailForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "site_password",
					name: "system_user[current_password]",
					label: "Current password",
				} ),
				formField( {
					type: "email",
					name: "system_user[email]",
					label: "Admin email",
					value: data.email
				} ),
				formCancel ( { onclick: "systemSystemUser._live();" } ),
				formSubmit(),
			],
			action: "/system/system_user/email",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					systemSystemUser._live();
				},
			}
		});

	},

};
