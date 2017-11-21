var formFieldCheckboxes = function( args ) {
	return formFieldWrapper(
		args,
		{
			style: "margin-left: 10px; margin-top: -10px;",
			id: ( args.id || "" ),
			$components: formFieldCheckboxesOptions( args )
		}
	);
};

var formFieldCheckboxesOptions = function( args ) {
	args.collectionIncludeBlank = false;
	values = args.value.replace(/\,\s*/g, ',').split(',');
	var ary = formFieldCollectionFormat( args );
	return ary.map( function ( option, i ) {
		return {
			class: "checkbox",
			$components: [
				{
					$type: "label",
					// title: args.title,
					$components: [
						$.extend (
							{
								$type: "input",
								type: "checkbox",
								name: args.name + '[]',
								value: option[0],
								id: ( ( args.id || "" ) + "_" + option[0] ),
								// value: option[0]
							},
							( values.includes( option[0] ) ? { checked: true } : {} )
						),
						{ $type: "span", style: "margin-left: 5px;", $text: ' ' + option[1] }
					]
				}
			]
		}
	} );
};
