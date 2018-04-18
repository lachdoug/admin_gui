var formFieldTextArea = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "textarea",
			class: "form-control",
			id: ( args.id || null ),
			style: ( args.style || null ),
			placeholder: ( args.placeholder || null ),
			type: ( args.type || "text" ),
			name: ( args.name || null ),
			value: ( args.value || null ),
			required: ( args.required || null ),
			pattern: ( args.pattern || null ),
			min: ( args.min || null ),
			max: ( args.max || null ),

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

		}
	);
};
