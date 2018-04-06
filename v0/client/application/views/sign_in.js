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
							id: "signInForm",
							components: function(f) {
								// debugger;
								return [
									remoteManagement ?
									f._field( { name: "data[system_ip]", title: "System IP address", label: false, required: true, placeholder: "IP address" } ) :
									f._field( { type: "hidden", name: "data[system_ip]", value: systemIp } ),

									f._field( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
									// f._field( { id:"xsomefield", name: "data[xosmefield]", dependOn: { input: "somefield", value: "hi" } } ),
									// f._field( { id:"somefield", name: "data[somefield]" } ),
									// f._field( { id:"zsomefield", name: "data[zsomefield]", type: "checkbox", collection: { "hi": "ho", "fe": "fi" } } ),
									// f._field( { id:"ysomefield", name: "data[ysomefield]", dependOn: { input: "zsomefield", value: "hi" } } ),
									f._submit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
								];
							},
							// components: [
							// 	formField( { name: "data[username]", value: "admin", label: false, required: true, placeholder: "User name", type: "hidden" } ),
							// 	formField( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
							// 	formSubmit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
							// ],
							action: "/system/signin",
							callbacks: {
								200: function (response) {
									main._renderSignedIn(response.system_ip);
								},
								// 503: function (responseJSON) {
								// 	alert( responseJSON.error.message );
								// 	signIn._live();
								// },
								401: function (responseJSON) {
									alert( responseJSON.error.message );
									signIn._live();
								}
							}
						}),
						// { $type: "hr" },
						// { $text: "Kerberos" },
						// {
						// 	$type: "form",
						// 	$components: [
						// 		// formField( { name: "data[username]", value: "admin", label: false, required: true, placeholder: "User name", label: "Username" } ),
						// 		formField( { id:"signInPassword", label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
						// 		formSubmit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
						// 	],
						// 	action: "/test_kerberos",
						// 	method: "POST"
						// },
						// form( {
						// 	components: [
						// 		{ $type: "hr" },
						// 		this._field({
						// 			name: "data[mybox2]",
						// 			label: "This is :checkbox_boolean",
						// 			type: "checkbox_boolean",
						// 			hint: "Enter correct value",
						// 			comment: "This field is important."
						// 		}),
						// 		// formField( { name: "data[mybox2]", label: "This is :checkbox_boolean", type: "checkbox_boolean", hint: "Enter correct value", comment: "This field is important." } ),
						// 		// enginesField( { name: "data[something1]", mandatory: true, input: { collection: { include_blank: true, items: [ ["a", "A"],["b", "B"],["c", "C"],["d", "D"] ] } , type: "select_multiple", label: "This is :select_multiple" } } ),
						// 		// enginesField( { name: "data[something2]", value: "2,3", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "select_multiple", label: ":select_multiple with preselected values" } } ),
						// 		// enginesField( { name: "data[something3]", value: "c", mandatory: true, input: { hint: "Enter correct value", comment: "This field is important.", collection: { include_blank: true, items: [ ["a", "A"],["b", "B"],["c", "C"],["d", "D"] ] } , type: "checkboxes", label: "This is :checkboxes", placeholder: "This is a placeholder" } } ),
						// 		// enginesField( { name: "data[something4]", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"],["3", "Three"],["4", "Four"] ] } , type: "select_with_input", label: "This is :select_with_input", validation: { pattern: 'a', message: "Must be 'a'" } } } ),
						// 		// enginesField( { name: "data[something5]", value: "1", mandatory: true, input: { collection: { include_blank: true, items: [ ["1", "One"],["2", "Two"] ] } , type: "checkbox", label: "this is checkbox", placeholder: "do it" } } ),
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
