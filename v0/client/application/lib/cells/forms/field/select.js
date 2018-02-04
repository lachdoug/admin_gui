var formFieldSelect = function( args ) {

// debugger

	return formFieldWrapper(
		args,
		formFieldSelectUnwrapped( args )
	);
};

var formFieldSelectUnwrapped = function( args ) {
	// debugger;
	return {
		$type: "select",
		class: args.class + " form-control",
		name: ( args.name || "" ),
		id: ( args.id || "" ),
		placeholder: ( args.placeholder || null ),
		required: ( args.required || false ),
		$components: formFieldCollectionSelectOptions( args ),
		onchange: function(e) {
			if ( args.onchange ) {
				return args.onchange(e)
			};
		},
		// $init: function () {
		// 	$(this).selectpicker();
		// },
	};
};
