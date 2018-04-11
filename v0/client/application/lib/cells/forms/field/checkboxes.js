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
	values = formFieldCollectionMultipleValues( args.value );
	var ary = formFieldCollectionFormat( args );
	return ary.map( function ( option, i ) {
		return {
			class: "checkbox",
			$components: [
				{
					$type: "label",
					$components: [
						$.extend (
							{
								$type: "input",
								type: "checkbox",
								name: args.name + '[]',
								value: option[0],
								id: ( ( args.id || "" ) + "_" + option[0] ),
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
