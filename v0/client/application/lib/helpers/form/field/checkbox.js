var formFieldCheckbox = function( args ) {
//	debugger;
	return formFieldWrapper(
		$.extend ( {}, args, { label: false } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "label",
					title: ( args.title || args.label ),
					$components: [
						$.extend(
							{
								$type: "input",
								name: ( args.name || "" ),
								title: ( args.title || args.label ),
								id: ( args.id || "" ),
								required: ( args.required || null ),
								// title: ( args.title || args.label ),
								value: 'true',
								type: "checkbox",
	//							checked:  ? "checked" : null,
							},
							[ 'checked', 'true', 'on', 'yes' ].some( function(option) { return option == ( args.value || "" ).toString().toLowerCase(); } ) ? { checked: "checked" } : {},
						),
						{
							$type: "span",
							$text: ( args.label || args.name )
						}
					],
				}
			],
		}
	);
};
