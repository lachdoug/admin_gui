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

			$init: function(){
				$("#signInPassword").blur();
			},

			$components: [
				{ style: "display: inline-block; text-align: left; width: 80%; max-width: 300px; margin-top: 50px;",
					$components: [
						form( {
							components: [
								formField( { name: "data[username]", value: "admin", label: false, required: true, placeholder: "User name", type: "hidden" } ),
								formField( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
								formSubmit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
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
						}),
						// form( {
						// 	components: [
						// 		{ $type: "hr" },
						// 		formField( { name: "data[mybox2]", label: "This is :checkbox_boolean", type: "checkbox_boolean", hint: "Enter correct value", comment: "This field is important." } ),
						// 		enginesField( { name: "data[something1]", mandatory: true, input: { collection: { include_blank: true, items: [ ["a", "A"],["b", "B"],["c", "C"],["d", "D"] ] } , type: "select_multiple", label: "This is :select_multiple" } } ),
						// 		enginesField( { name: "data[something2]", value: "2,3", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "select_multiple", label: ":select_multiple with preselected values" } } ),
						// 		enginesField( { name: "data[something3]", value: "c", mandatory: true, input: { hint: "Enter correct value", comment: "This field is important.", collection: { include_blank: true, items: [ ["a", "A"],["b", "B"],["c", "C"],["d", "D"] ] } , type: "checkboxes", label: "This is :checkboxes", placeholder: "This is a placeholder" } } ),
						// 		enginesField( { name: "data[something4]", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "select_with_input", label: "This is :select_with_input", validation: { pattern: 'a', message: "Must be 'a'" } } } ),
						// 		// enginesField( { name: "data[something4]", value: "2", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "checkbox", label: "hi", placeholder: "do it" } } ),
						//
						// 		formSubmit(),
						//
						// 	],
						// 	action: "/",
						// }),

					]
				}
			]
		}
	},

};
