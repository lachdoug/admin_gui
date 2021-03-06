var formFieldInput = function( args ) {
	return formFieldWrapper(
		args,
		formFieldInputUnwrapped( args )
	);
};

var formFieldInputUnwrapped = function( args ) {

	return $.extend(
		{
			$type: "input",
			class: ( args.class || "" ) + " form-control",
			id: args.id || null,
			style: args.style || null,
			placeholder: args.placeholder || null,
			type: args.type || "text",
			name: args.name || null,
			value: args.value || null,
			pattern: args.pattern || null,
			min: args.min || null,
			max: args.max || null,
			autocomplete: args.autocomplete || null,

			onchange: function(e) {
				if ( args.onchange ) {
					return args.onchange(e)
				};
			},

			oninput: function(e) {

				function checkPattern() {
					if(e.target.validity.patternMismatch) {
						e.target.setCustomValidity(
							args.patternMessage ||
							( 'Must match pattern ' + args.pattern )
						);
						return false;
					} else { e.target.setCustomValidity('')
						return true;
				  };
				}

				if ( args.oninput ) {
					if ( args.oninput(e) ) {
						return checkPattern()
					}
				} else {
					return checkPattern();
				};
			},

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
