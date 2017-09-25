var $signIn = {

	$cell: true,
	id: "signIn",


	_live: function () {
		$("#pageLoadingSpinner").fadeOut();
		this.$components = [ this._form() ]
	},


	_kill: function () {
		this.$components = []
	},


	_form: function () {
		return {
			class: "text-center",
			$components: [
				{ style: "display: inline-block; text-align: left; width: 80%; max-width: 300px; margin-top: 50px;",
					$components: [
						form( {
							components: [
								formField( { name: "data[user_name]", value: "admin", label: false, placeholder: "User name", wrapperClass: "hidden" } ),
								formField( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", placeholder: "Password", title: "System admin password" } ),
								formSubmit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } )
							],
							action: "/session",
							callbacks: {
								200: function () {
									signIn._kill();
									system._live();
								},
								401: function (responseJSON) {
									alert( responseJSON.error.message );
									signIn._live();
								}
							}
						})
					]
				}
			]
		}
	},

};
