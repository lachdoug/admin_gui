var formFieldSelectOptions = function( args ) {
	var ary = formFieldCollectionFormat( args );
	return ary.map( function (option) {
		return $.extend (
			{
				$type: "option",
				$text: "" + ( option[1] ),
				value: "" + option[0],
			},
			( ( args.value == option[0] ) ? { selected: true } : {} )
		)
	} );
};
