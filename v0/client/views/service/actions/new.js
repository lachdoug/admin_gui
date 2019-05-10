var $serviceActionatorsNew = {

	$cell: true,
	id: "serviceActionatorsNew",

	_live: function (serviceName, actionatorName) {

		this._serviceName = serviceName;
		this._actionatorName = actionatorName;
		this._load();

	},


	_show: function ( data ) {

		var serviceName = this._serviceName;
		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service actionator",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						hasVariables ?
						serviceActionatorsNew._form( data ) :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	_postWithoutParams: function ( data ) {

		var serviceName = this._serviceName;

		apiRequest({
			action: "/services/" + serviceName + "/actionator",
			params: { actionator_name: data.name },
			method: "POST",
			callbacks: {
				200: function( response ) {
					serviceActionatorsResult._live( serviceName, data, response )
				},
			}
		});
	},

	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/actionator",
			params: { actionator_name: this._actionatorName },
			callbacks: {
				200: function(response) {
					serviceActionatorsNew._show( response );
				}
			}
		});
	},


	_form: function ( data ) {

		var serviceName = this._serviceName;

		return form( {
			components: [
				inDevelopment ? pp(data) : {},
				formField( {
					type: "hidden",
					name: "actionator_name",
					value: data.name
				} ),
				{
					$components: ( data.variables || [] ).map( function ( variable ) {
						variable.name_prefix = "variables";
						return enginesField( variable );
					} )
				},
				formCancel ( {
					onclick: function () {
						serviceActionators._live( serviceName );
					}
				} ),
				formSubmit(),
			],
			action: "/services/" + serviceName + "/actionator",
			method: "POST",
			callbacks: {
				200: function(response) {
					serviceActionatorsResult._live( serviceName, data, response );
				},
			}
		} )

	}

};
