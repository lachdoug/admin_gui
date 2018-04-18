function form(args) {

	var query_params = jQuery.param( args.params || {} );

	return {
		$type: "form",
		class: "clearfix",
		id: args.id,
		action: args.action + "?" + query_params,
		method: args.method,
		enctype: args.enctype || "application/x-www-form-urlencoded",
		_callbacks: args.callbacks,
		// $components: (typeof args.components === "function") ? args.components(this) : ( args.components || [] ),
		$init: function() {
			this.$components = (typeof args.components === "function") ? args.components(this) : ( args.components || [] );

			if ( args.init ) {
				args.init( this );
			} else {
				api._bindForm( this );
			};

		},
		_field: function( args ) {
			args._formId = args.id;
			return formField( args );
		},
		_submit: function( args ) {
			args._formId = args.id;
			return formSubmit( args );
		},
		_cencel: function( args ) {
			args._formId = args.id;
			return formCancel( args );
		},

	}
};
