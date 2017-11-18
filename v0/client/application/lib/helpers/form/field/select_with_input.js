function formFieldSelectWithInput( args ) {

	// debugger;

	var selectCollectionValues = args.collection.map( function( item ) { return item[0] } );
	var valueInSelectCollection = selectCollectionValues.includes( args.value );
// debugger
	args.collection = [["__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__", "- Custom value -"]].concat( args.collection );



	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldInputUnwrapped(
					{
						name: args.name,
						id: args.id,
						type: "hidden",
						value: args.value
					}
					// $.extend(
					// 	{},
					// 	args,
					// 	{ input: $.extend(
					// 		{},
					// 		args.input,
					// 		{ type: "hidden" }
					// 	) }
					// )
				),
				formFieldSelectUnwrapped(
					$.extend(
						{},
						args,
						{
							id: args.id + "_primary_select",
							name: "",
							// onchange: function() {
							// 	formFieldSelectWithInputShowInputCheck(args.id);
							// },
						},
						valueInSelectCollection ? {} : { value: "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" }
					)
				),
				formFieldInputUnwrapped(
					$.extend (
						{},
						args,
						{
							id: args.id + "_secondary_input",
							name: "",
							placeholder: "Enter a custom value",
							style: "margin-top: 5px;" + ( valueInSelectCollection ? " display: none;" : "" ),
						},
						valueInSelectCollection ? { value: '' } : {}
					)
				),
			],
			onchange: function() {
				formFieldSelectWithInputUpdateControl(args.id);
			},
			$init: function() {
				formFieldSelectWithInputUpdateControl(args.id);
			},
		}
	);
};

function formFieldSelectWithInputUpdateControl(inputId) {
	if ( $( "#" + inputId + "_primary_select" ).val() == "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" ) {
		$( "#" + inputId ).val( $( "#" + inputId + "_secondary_input" ).val() );
		$( "#" + inputId + "_secondary_input" ).prop('disabled', false);
		$( "#" + inputId + "_secondary_input" ).show();
	} else {
		$( "#" + inputId ).val( $( "#" + inputId + "_primary_select" ).val() );
		$( "#" + inputId + "_secondary_input" ).prop('disabled', true);
		$( "#" + inputId + "_secondary_input" ).hide();
	};
};

// function formFieldSelectWithInputShowInputCheck(inputId) {
// 	// alert( $( "#" + inputId ).val() == "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" );
// 	if ( $( "#" + inputId + "_primary_select" ).val() == "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" ) {
// 		$( "#" + inputId + "_secondary_input" ).show();
// 	} else {
// 		$( "#" + inputId + "_secondary_input" ).hide();
// 	};
// };
