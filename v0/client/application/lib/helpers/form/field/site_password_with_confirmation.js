var formFieldSitePasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,
		formFieldInputUnwrapped( 
			$.extend( {}, args, { 
				type: "password",
				oninput: "formFieldSitePasswordWithConfirmationCheckMatch('" + args.id + "');",
			} )
		),
		formFieldInputUnwrapped( 
			$.extend ( {}, args, { 
				type: "password",
				id: args.id + "_confirmation", 
				placeholder: "Confirm password", 
				style: "margin-top: 5px;", 
				oninput: "formFieldSitePasswordWithConfirmationCheckMatch('" + args.id + "');",
			} ) 
		),
	);
};

var formFieldSitePasswordWithConfirmationCheckMatch = function (inputId) {
	if ( $( "#" + inputId ).val() != $( "#" + inputId + "_confirmation" ).val() ) {
			$( "#" + inputId + "_confirmation" )[0].setCustomValidity("Passwords must match.");
	} else {
			$( "#" + inputId + "_confirmation" )[0].setCustomValidity("");
	}
};
