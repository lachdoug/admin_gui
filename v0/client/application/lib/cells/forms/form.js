function form(obj) {

	return {
		$type: "form",
		class: "clearfix",
		id: obj.id,
		// $components: ,
		action: obj.action,
		method: obj.method,
		enctype: obj.enctype || "application/x-www-form-urlencoded",
		_callbacks: obj.callbacks,
		$init: function() {
// debugger;
			this.$components = (typeof obj.components === "function") ? obj.components(this) : ( obj.components || [] );

			if ( obj.init ) {
				obj.init( this );
			} else {
				api._bindForm( this );
			};
			// debugger;
			$(this).find("input:invalid").first().focus();
		},
		_field: function( args ) {
			args._formId = obj.id;
			return formField( args );
		},
		_submit: function( args ) {
			args._formId = obj.id;
			return formSubmit( args );
		},
		_cencel: function( args ) {
			args._formId = obj.id;
			return formCancel( args );
		},

	}
};
