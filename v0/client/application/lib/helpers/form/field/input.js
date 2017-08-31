var formFieldInput = function( args ) {
//	if ( args.name == "form[services][][publisher_namespace]" ) { debugger }
	return formFieldWrapper(
		args,
		formFieldInputUnwrapped( args )
	);
};

var formFieldInputUnwrapped = function( args ) {
	return { 
			$type: "input", 
			class: "form-control",
			id: ( args.id || null ),
			style: ( args.style || null ),
			placeholder: ( args.placeholder || null ), 
			type: ( args.type || "text" ), 
			name: ( args.name || null ), 
			value: ( args.value || null ),
			required: ( args.required || false ),
			disabled: ( args.disabled || null ),
			pattern: ( args.pattern || null ),
			min: ( args.min || null ),
			max: ( args.max || null ),
			_patternMessage: ( args.patternMessage || null ),
			oninput: args.oninput || null,
			onchange: args.onchange || null,
			autocomplete: args.autocomplete || null,
		
			$init: function () {
				
				var onkeyup = args.onkeyup;
				if (onkeyup) {
					$(this).bind( "keyup paste cut", function () {
						onkeyup(this);
					} );
				};

				var onkeydown = args.onkeydown;
				if (onkeydown) {
					$(this).bind( "keydown", function () {
						onkeydown(this);
					} );
				};
				
				var init = args.init;
				if (init) {
					init(this);
				};

			},
		};
};
