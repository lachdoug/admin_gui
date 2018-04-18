function formFieldSelectWithInput( args ) {
	var selectCollection = formFieldCollectionFormat( $.extend({}, args, { collectionIncludeBlank: false }) );
	var selectCollectionValues = selectCollection.map( function( item ) { return item[0] } );
	var showSecondaryInput = args.value && !selectCollectionValues.includes( args.value );
	args.collection = [["__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__", "- Custom value -"]].concat( selectCollection );

	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldInputUnwrapped(
					{
						name: args.name,
						id: args.id,
						class: "form_field_select_with_input_hidden_input",
						type: "hidden",
						value: args.value
					}
				),
				formFieldSelectUnwrapped(
					$.extend(
						{},
						args,
						{
							class: "form_field_select_with_input_primary_select",
							value: args.value || '',
							name: "",
						},
						showSecondaryInput ? { value: "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" } : {}
					)
				),
				formFieldInputUnwrapped(
					$.extend (
						{},
						args,
						{
							class: "form_field_select_with_input_secondary_input",
							name: "",
							placeholder: "Enter a custom value",
							style: "margin-top: 5px;" + ( showSecondaryInput ? "" : " display: none;" ),
						},
						showSecondaryInput ? {} : { value: '' }
					)
				),
			],
			onchange: function() {
				formFieldSelectWithInputUpdateControl(this);
			},
			$init: function() {
				formFieldSelectWithInputUpdateControl(this);
			},
		}
	);
};

function formFieldSelectWithInputUpdateControl(control) {
	if (
		$(control).find(".form_field_select_with_input_primary_select").val() ==
		"__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__"
	) {
		$(control).find(".form_field_select_with_input_hidden_input").val(
			$(control).find(".form_field_select_with_input_secondary_input" ).val()
		);
		var secondaryInput = $(control).find(".form_field_select_with_input_secondary_input");
		secondaryInput.prop('disabled', false);
		secondaryInput.show();
	} else {
		$(control).find(".form_field_select_with_input_hidden_input").val(
			$(control).find(".form_field_select_with_input_primary_select").val()
		);
		var secondaryInput = $(control).find(".form_field_select_with_input_secondary_input");
		secondaryInput.prop('disabled', true);
		secondaryInput.hide();
	};
};
