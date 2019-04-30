var formFieldSelect = function( args ) {
	return formFieldWrapper(
		args,
		formFieldSelectUnwrapped( args )
	);
};

var formFieldSelectUnwrapped = function( args ) {
	return {
		...{
			$type: "select",
			class: ( args.class || "" ) + " form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			placeholder: ( args.placeholder || null ),
			$components: formFieldCollectionSelectOptions( args ),
			onchange: function(e) {
				if ( args.onchange ) {
					return args.onchange(e)
				};
			},
		},
		...args.required ? { required: 'required' } : {},
		...args.disabled ? { disabled: 'disabled' } : {},
	}
};
