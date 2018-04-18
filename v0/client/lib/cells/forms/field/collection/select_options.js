var formFieldCollectionSelectOptions = function( args ) {
	var ary = formFieldCollectionFormat( args );
	return ary.map( function (option, i) {
		return $.extend (
			{
				$type: "option",
				$text: "" + ( option[1] ),
				value: "" + option[0],
			},
			( ( args.value == option[0] ) ? { selected: "selected" } : {} ),
			( i == 0 && args.collectionIncludeBlank ) ? { disabled: "disabled" } : {}
		)
	} );
};
