function formFieldPassword( args ) {
	return formFieldWrapper(
		args,
		formFieldPasswordUnwrapped( args ),
	);
};

function formFieldPasswordUnwrapped( args ) {

	return formFieldInputUnwrapped(
		$.extend ( {}, args,
			{
				type: "text",
				autocomplete: "off",
				input: formFieldPasswordUnwrappedDoSecurityFont,
				onkeydown: formFieldPasswordUnwrappedDoSecurityFont,
				onkeyup: formFieldPasswordUnwrappedDoSecurityFont,
				init: formFieldPasswordUnwrappedDoSecurityFont
			}
		)
	);

};

function formFieldPasswordUnwrappedDoSecurityFont ( input ) {
	if ( $(input).val().length == 0 ) {
		$(input).css( "font-family", "inherit" );
		$(input).css( "letter-spacing", "inherit" );
		$(input).css( "font-size", "inherit" );
	} else {
		$(input).css( "font-family", "text-security-disc" );
		$(input).css( "letter-spacing", "1px" );
		$(input).css( "font-size", "18px" );
	};
};
