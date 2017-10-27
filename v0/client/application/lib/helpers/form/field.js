function formField(args) {
//	debugger;
	switch( args.type )	{
		case "string":
			return formFieldInput($.extend( {}, args, { type: "text" } ) );
		case "text":
			return formFieldTextArea( args );
		case "select":
			return formFieldSelect(args);
		case "radios":
			return formFieldRadios(args);
		case "checkbox":
			return formFieldCheckbox(args);
		case "hidden":
			return formFieldInputUnwrapped( args );
		case "country":
			return formFieldCountry( args );
		case "language":
			return formFieldLanguage( args );
		case "timezone":
			return formFieldTimezone( args );
		case "file":
			return formFieldInput( $.extend( {}, args, { style: "height: inherit; " + args.style } ) )
		case "password":
			return formFieldPassword( args );
		case "password2":
			return formFieldPassword2( args );
		case "password_with_confirmation":
			return formFieldPasswordWithConfirmation(args);
		case "site_password":
			return formFieldInput( $.extend( {}, args, { type: "password" } ) );
		case "site_password_with_confirmation":
			return formFieldSitePasswordWithConfirmation(args);
		default:
			return formFieldInput( args );
	};
};


	//[ :string,
	//	:boolean,
	//	:email,
	//	:url,
	//	:tel,
	//	:password,
	//	:password_with_confirmation,
	//	:uuid,
	//	:text,
	//	:file,
	//	:hidden,
	//	:integer,
	//	:float,
	//	:decimal,
	//	:range,
	//	:datetime,
	//	:date,
	//	:time,
	//	:select,
	//	:radio_buttons,
	//	:check_boxes,
	//	:country,
	//	:time_zone ]
	// add :select_multiple, :language, :country, :timezone
