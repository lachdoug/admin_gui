function formFieldCollectionFormat ( args ) {
  // debugger;
  var ary = [];
	var collection_ary_or_obj = args.collection;
	if ( collection_ary_or_obj.constructor.name == "Object" ) {
		for ( var prop in collection_ary_or_obj ) {
			ary.push( [ prop, collection_ary_or_obj[prop] ] );
		};
	} else {
		ary = formFieldCollectionFormatLabels( collection_ary_or_obj || [] );
	};
	if ( args.collectionIncludeBlank ) {
		ary = [ [ "", (args.placeholder || "Please select") ] ].concat( ary );
	};
  return ary;
};

function formFieldCollectionFormatLabels( options ) {
  return options.map( function ( option ) {
    if ( option.constructor.name == "String" ) {
      return [ option, option ];
    } else {
      return option;
    };
  });
};
