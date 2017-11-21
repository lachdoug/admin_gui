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
								formField( { name: "data[username]", value: "admin", label: false, required: true, placeholder: "User name", type: "hidden" } ),
								formField( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),


								// enginesField( { name: "data[something2]", value: "2,3", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "select_multiple", label: "hi", placeholder: "do it" } } ),
								// enginesField( { name: "data[something3]", value: "2,4", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "checkboxes", label: "hi", placeholder: "do it" } } ),
								// enginesField( { name: "data[something4]", value: "2", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "checkbox", label: "hi", placeholder: "do it" } } ),


								formSubmit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } )
							],
							action: "/system/signin",
							callbacks: {
								200: function () {
									$("#pageLoadingSpinner").fadeIn();
									signIn._kill();
									system._live();
								},
								503: function (responseJSON) {
									alert( responseJSON.error.message );
									signIn._live();
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
