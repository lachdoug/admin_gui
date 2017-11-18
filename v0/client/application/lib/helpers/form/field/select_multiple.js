var formFieldSelectMulti = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "select",
			class: "form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			multiple: "multiple",
			placeholder: ( args.placeholder || null ),
			required: ( args.required || false ),
			$init: function () {
				$(this).selectpicker();
			},
			$components: formFieldSelectOptions( args )
		}
	);
};
