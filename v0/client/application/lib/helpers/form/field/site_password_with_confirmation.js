var formFieldSitePasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,{
			$components: [
				formFieldInputUnwrapped(
					$.extend( {}, args, {
						type: "password",
						oninput: function (e) {
							formFieldSitePasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
				formFieldInputUnwrapped(
					$.extend ( {}, args, {
						type: "password",
						id: args.id + "_confirmation",
						placeholder: "Confirm password",
						style: "margin-top: 5px;",
						oninput: function(e) {
							formFieldSitePasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
			]
		}
	);
};

var formFieldSitePasswordWithConfirmationCheckMatch = function (event) {
	var inputs = event.target.parentElement.children;
	if ( inputs[0].value != inputs[1].value ) {
			inputs[0].setCustomValidity("Passwords must match.");
	} else {
			inputs[0].setCustomValidity("");
	}
};
