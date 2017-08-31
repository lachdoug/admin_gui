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
			_patternMessage: ( args.patternMessage || null ),
			oninput: args.oninput || null,
		}
	);
};

