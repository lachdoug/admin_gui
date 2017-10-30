var formFieldInput = function( args ) {
//	if ( args.name == "data[services][][publisher_namespace]" ) { debugger }
	return formFieldWrapper(
		args,
		formFieldInputUnwrapped( args )
	);
};

var formFieldInputUnwrapped = function( args ) {
	// return pp(args);
	return $.extend(
		{
			$type: "input",
			class: "form-control",
			id: args.id || null,
			style: args.style || null,
			placeholder: args.placeholder || null,
			type: args.type || "text",
			name: args.name || null,
			value: args.value || null,
			pattern: args.pattern || null,
			min: args.min || null,
			max: args.max || null,
			// _patternMessage:  || null,
			oninput: args.oninput || null,
			// onchange: args.onchange || null,
			autocomplete: args.autocomplete || null,
			onchange: function(el) {
				// debugger;
				if ( args.onchange ) { args.onchange(el) };
				if(el.target.validity.patternMismatch) {
					el.target.setCustomValidity(
						args.patternMessage ||
						( 'Must match pattern ' + args.pattern )
					)
				} else { el.target.setCustomValidity('')
			  };
			},
			// setCustomValidity('') allows other validations (e.g. required) to show errors

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
		},
		args.required ? { required: 'required' } : {},
		args.disabled ? { disabled: 'disabled' } : {},
	);
};
