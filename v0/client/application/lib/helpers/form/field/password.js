var formFieldPassword = function( args ) {
	return formFieldWrapper(
		args,
		formFieldPasswordUnwrapped( args ),
	);
};

var formFieldPasswordUnwrapped = function (args) {
	
	return formFieldInputUnwrapped( 
		$.extend ( {}, args, 
			{ 
				type: "text",
				autocomplete: "off",
				onkeydown: function (input) {
					$(input).css( "font-family", "text-security-disc" );
					$(input).css( "letter-spacing", "1px" );
					$(input).css( "font-size", "18px" );
				}, 
				onkeyup: function (input) { 
					if ( $(input).val().length == 0 ) { 
						$(input).css( "font-family", "inherit" );
						$(input).css( "letter-spacing", "inherit" );
						$(input).css( "font-size", "inherit" );
					};
				}
			}
		) 
	);

};
