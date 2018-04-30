var $systemAdminUserEmail = {

	$cell: true,
	id: "systemAdminUserEmail",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-lock", text: "System API admin email" } ),
				body: {
					$components: [
						{
							id: "systemAdminUserEmailForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemAdminUserEmail._form( data ) ];
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
			action: "/system/api_admin",
			callbacks: {
				200: function(response) {
					systemAdminUserEmailForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "site_password",
					name: "api_admin[current_password]",
					label: "Current password",
				} ),
				formField( {
					type: "email",
					name: "api_admin[email]",
					label: "Admin email",
					value: data.email
				} ),
				formCancel ( { onclick: "systemAdminUser._live();" } ),
				formSubmit(),
				pp( data )
			],
			action: "/system/api_admin/email",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					systemAdminUser._live();
				},
			}
		});

	},

};
