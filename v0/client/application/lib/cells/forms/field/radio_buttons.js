var formFieldRadioButtons = function( args ) {
	return formFieldWrapper(
		args,
		{
			style: "margin-left: 10px; margin-top: -10px;",
			id: ( args.id || "" ),
			$components: formFieldRadioButtonsOptions( args )
		}
	);
};

var formFieldRadioButtonsOptions = function( args ) {
	var ary = formFieldCollectionFormat( args );
	return ary.map( function ( option, i ) {
		return {
			class: "radio",
			$components: [
				{
					$type: "label",
					$components: [
						$.extend (
							{
								$type: "input",
								type: "radio",
								name: ( args.name || "" ),
								id: args.id ? ( ( args.id || "" ) + "_" + option[0] ) : "",
								value: option[0],
							},
							( ( args.value == option[0] ) ? { checked: true } : {} ),
							( args.required ? { required: true } : {} )
						),
						{ $type: "span", $text: option[1] }
					]
				}
			]
		}
	} );
};
