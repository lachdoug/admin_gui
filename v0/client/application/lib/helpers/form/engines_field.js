function enginesField( args ) {
	return formField( {
		type: dig( args, "input", "type" ),
		name: args.name_prefix ? args.name_prefix + "[" + args.name + "]" : args.name,
		id: args.id || ("enginesFormField_" + args.name).replace(/(\[|\])/g, "_"),
		label: dig( args, "input", "label" ) || args.name,
		value: args.value,
		required: args.mandatory,
		title: dig( args, "input", "title" ) || dig( args, "input", "label" ) || args.name,
		pattern: dig( args, "input", "validation", "pattern" ) ,
		patternMessage: dig( args, "input", "validation", "message" ),
		comment: dig( args, "input", "comment" ),
		hint: dig( args, "input", "hint" ),
		placeholder: dig( args, "input", "placeholder" ),
		collection: dig( args, "input", "collection", "items" ) || [],
		collectionIncludeBlank: dig( args, "input", "collection", "include_blank" )
	} );
};
