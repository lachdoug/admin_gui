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

			// $init: function(){
			// 	// $("#signInPassword").blur();
			// },

			$components: [
				{ style: "display: inline-block; text-align: left; width: 80%; max-width: 300px; margin-top: 50px;",
					$components: [
						form({
							id: "signInForm",
							components: function(f) {
								return [
									remoteManagement ?
										f._field( { name: "data[system_ip]", title: "System IP address", label: false, required: true, placeholder: "IP address" } ) :
										f._field( { wrapperClass: "hidden", name: "data[system_ip]", value: systemIp } ),
									f._field( { label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
									f._submit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
								];
							},
							action: "/system/signin",
							callbacks: {
								200: function (response) {
									main._renderSignedIn(response.system_ip);
								},
								401: function (responseJSON) {
									alert( responseJSON.error.message );
									signIn._live();
								}
							}
						}),


					]
				}
			]
		}
	},

};
