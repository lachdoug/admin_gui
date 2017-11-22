var formFieldCheckboxBoolean = function( args ) {

	var checked = [ 'true', 'on', 'yes', '1' ].some( function(option) { return option == ( args.value || "" ).toString().toLowerCase(); } );

	return formFieldWrapper(
		$.extend ( {}, args, { label: false } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "input",
					name: ( args.name || "" ),
					id: ( args.id || "" ),
					value: checked ? 'true' : 'false',
					type: "hidden",
				},
				{
					$type: "label",
					title: ( args.title || args.label ),
					$components: [
						$.extend(
							{
								$type: "input",
								// name: ( args.name +  || "" ),
								title: ( args.title || args.label ),
								// id: ( args.id || "" ),
								required: ( args.required || null ),
								// value: '1',
								type: "checkbox",
								onchange: function () {
									$(this).parent().prev().val( $(this).prop('checked') );
								},
							},
							checked ? { checked: "checked" } : {},
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
