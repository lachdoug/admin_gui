var formFieldColor = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "input",
			type: "color",
			class: "form-control",
			style: "width: 45px;",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			value: ( args.value ),
		}
	);
};
