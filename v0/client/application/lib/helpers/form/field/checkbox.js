var formFieldCheckbox = function( args ) {

	return formFieldWrapper(
		$.extend ( {}, args, { label: false, title: ( args.title || args.label ) } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "label",
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
								value: args.value || '1',
								type: "checkbox",
							},
							[ 'checked', 'true', 'on', 'yes', '1' ].some( function(option) { return option == ( args.value || "" ).toString().toLowerCase(); } ) ? { checked: "checked" } : {},
						),
						args.label == false ? {} : {
							$type: "strong",
							style: "margin-left: 5px;",
							$text: ( args.label || args.name )
						}
					],
				}
			],
		}
	);
};
