var formFieldPasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldPasswordUnwrapped(
					$.extend( {}, args, {
						oninput: function(e) {
							formFieldPasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
				formFieldPasswordUnwrapped(
					$.extend ( {}, args, {
						id: args.id + "_confirmation",
						placeholder: "Confirm password",
						style: "margin-top: 5px;",
						oninput: function(e) {
							formFieldPasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
			]
		}
	);
};

var formFieldPasswordWithConfirmationCheckMatch = function (event) {
	var inputs = event.target.parentElement.children;
	if ( inputs[0].value != inputs[1].value ) {
			inputs[0].setCustomValidity("Passwords must match.");
	} else {
			inputs[0].setCustomValidity("");
	}
};
