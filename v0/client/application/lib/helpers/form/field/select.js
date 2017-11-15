var formFieldSelect = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "select",
			class: "form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			placeholder: ( args.placeholder || null ),
			required: ( args.required || false ),
			$components: formFieldSelectOptions( args ),
			onchange: function(e) {
				if ( args.onchange ) {
					return args.onchange(e)
				};
			},

		}
	);
};

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

var formFieldSelectOptions = function( args ) {
	var ary = [];
	var collection_ary_or_obj = args.collection;
	if ( collection_ary_or_obj.constructor.name == "Object" ) {
		for ( var prop in collection_ary_or_obj ) {
			ary.push( [ prop, collection_ary_or_obj[prop] ] );
		};
	} else {
		ary = ( collection_ary_or_obj || [] );
	};
	return ary.map( function (option) {
		if ( option && ( option.constructor.name == "Array" ) ) {
			return $.extend (
				{
					$type: "option",
					$text: "" + option[1],
					value: "" + option[0],
				},
				( ( args.value == option[0] ) ? { selected: true } : {} )
			)
		} else {
			return $.extend (
				{
				$type: "option",
				$text: "" + option,
				value: "" + option,
				},
				( ( args.value == option ) ? { selected: true } : {} )
			)
		};
	} );
};
