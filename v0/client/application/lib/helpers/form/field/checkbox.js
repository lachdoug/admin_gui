var formFieldCheckbox = function( args ) {

	var collection = formFieldCollectionFormat( args );
	var checkboxValue = ( collection[0] || [] )[0] || '1'
	var checkboxText = ( collection[0] || [] )[1] || 'Select'

	return formFieldWrapper(
		$.extend ( {}, args, { label: args.label, title: ( args.title || args.label ) } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "label",
					// style: "font-weight: normal;",
					// title: ( args.title || args.label ),
					$components: [
						$.extend(
							{
								$type: "input",
								name: ( args.name || "" ),
								title: ( args.title || args.label ),
								id: ( args.id || "" ),
								required: ( args.required || null ),
								// title: ( args.title || args.label ),
								value: checkboxValue,
								type: "checkbox",
							},
							checkboxValue == args.value ? { checked: "checked" } : {},
						),
						args.label == false ? {} : {
							// $type: "strong",
							style: "margin-left: 5px;",
							$text: ( checkboxText )
						}
					],
				}
			],
		}
	);
};
