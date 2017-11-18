var formFieldSelectOptions = function( args ) {
	var ary = [];
	var collection_ary_or_obj = args.collection;
	if ( collection_ary_or_obj.constructor.name == "Object" ) {
		for ( var prop in collection_ary_or_obj ) {
			ary.push( [ prop, collection_ary_or_obj[prop] ] );
		};
	} else {
		ary = ( collection_ary_or_obj || [] );
	};
	if ( args.collectionIncludeBlank ) {
		ary = [ [ "", ""] ].concat( ary );
	};
	return ary.map( function (option) {
		if ( option && ( option.constructor.name == "Array" ) ) {
			return $.extend (
				{
					$type: "option",
					$text: "" + ( option[1] || option[0] ),
					value: "" + option[0],
				},
				( ( args.value == option[0] ) ? { selected: true } : {} )
			)
		} else {
			return $.extend (
				{
				$type: "option",
				$text: "" + option,
				value: "" + option,
				},
				( ( args.value == option ) ? { selected: true } : {} )
			)
		};
	} );
};
