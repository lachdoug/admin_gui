var formFieldRadios = function( args ) {
	return formFieldWrapper(
		args,
		{
			style: "margin-left: 10px; margin-top: -10px;",
			id: ( args.id || "" ),
			$components: formFieldRadiosOptions( args )
		}
	);
};

var formFieldRadiosOptions = function( args ) {
	var ary = [];
	for ( var prop in args.collection ) {
		ary.push ( [ prop, args.collection[prop] ] );
	};
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
								id: ( ( args.id || "" ) + "_" + option[0] ),
								// value: option[0]
							},
							( ( args.value == option[0] ) ? { checked: true } : {} )
						),
						{ $type: "span", $text: option[1] }
					]
				}
			]
		}
	} );
};
