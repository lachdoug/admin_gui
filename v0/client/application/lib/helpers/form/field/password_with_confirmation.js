var formFieldPasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldPasswordUnwrapped(
					$.extend( {}, args, {
						oninput: "formFieldPasswordWithConfirmationCheckMatch('" + args.id + "');",
					} )
				),
				formFieldPasswordUnwrapped(
					$.extend ( {}, args, {
						id: args.id + "_confirmation",
						placeholder: "Confirm password",
						style: "margin-top: 5px;",
						oninput: "formFieldPasswordWithConfirmationCheckMatch('" + args.id + "');",
					} )
				),
			]
		}
	);
};

var formFieldPasswordWithConfirmationCheckMatch = function (inputId) {
	if ( $( "#" + inputId ).val() != $( "#" + inputId + "_confirmation" ).val() ) {
			$( "#" + inputId + "_confirmation" )[0].setCustomValidity("Passwords must match.");
	} else {
			$( "#" + inputId + "_confirmation" )[0].setCustomValidity("");
	}
};
