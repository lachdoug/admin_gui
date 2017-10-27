var $systemAdminUserEmail = {
	
	$cell: true,
	id: "systemAdminUserEmail",
	
	
	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-lock", text: "Admin user password" } ),
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
			action: "/system/user/admin",
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
					name: "data[current_password]", 
					id: "systemAdminUserPasswordField_current_password", 
					label: "Current password",
				} ),
				formField( {
					type: "hidden",
					name: "data[username]",
					value: "admin",
				} ),
				formField( {
					type: "email", 
					name: "data[email]", 
//					id: "systemAdminUserEmailField_default_site", 
					label: "Admin email",
					value: data.email
				} ),
				formCancel ( { onclick: "systemAdminUser._live();" } ),
				formSubmit(),
//				pp( data )
			],
			action: "/system/user/admin",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					systemAdminUser._live();
				},
			}
		});
		
	},
	
};
