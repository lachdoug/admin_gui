var enginesField = function (obj) {
	return formField( {
		type: dig( obj, "input", "type" ),
		name: obj.name,
		id: obj.id || "",
		label: dig( obj, "input", "label" ) || obj.name,
		value: obj.value,
		required: obj.mandatory,
		title: dig( obj, "input", "title" ) || obj.name,
		pattern: dig( obj, "input", "validation", "pattern" ) ,
		patternMessage: dig( obj, "input", "validation", "pattern" ),
		comment: dig( obj, "input", "comment" ),
		hint: dig( obj, "input", "hint" ),
		placeholder: dig( obj, "input", "placeholder" ),
		collection: dig( obj, "input", "collection", "items" ),
		collectionIncludeBlank: dig( obj, "input", "collection", "include_blank" )
	} );
};
