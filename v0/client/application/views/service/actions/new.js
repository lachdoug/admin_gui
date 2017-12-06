var $serviceActionsNew = {

	$cell: true,
	id: "serviceActionsNew",

	// _serviceName: null,
	// _actionName: null,
	// _data: null,


	_live: function (serviceName, actionName) {

		this._serviceName = serviceName;
		this._actionName = actionName;
		this._load();

	},


	_show: function ( data ) {

		var serviceName = this._serviceName;
		// this._data = data;

		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service action",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						hasVariables ?
						serviceActionsNew._form( data ) :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	_postWithoutParams: function ( data ) {

		var serviceName = this._serviceName;
		// var data = this._data;

		var queryString =
			"actionator_name=" + encodeURIComponent( data.name );
		apiRequest({
			action: "/services/" + serviceName + "/action?" + queryString,
			method: "POST",
			callbacks: {
				200: function( response ) {
					serviceActionsResult._live( serviceName, data, response )
				},
			}
		});
	},

	_load: function () {
		var queryString =
			"actionator_name=" + encodeURIComponent( this._actionName );
		apiRequest({
			action: "/services/" + this._serviceName + "/action?" + queryString,
			callbacks: {
				200: function(response) {
					serviceActionsNew._show( response );
				}
			}
		});
	},


	_form: function ( data ) {

		var serviceName = this._serviceName;
		// var data = this._data;

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
						// debugger;
						return enginesField( variable );
					} )
				},
				formCancel ( {
					onclick: function () {
						serviceActions._live( serviceName );
					}
				} ),
				formSubmit(),
			],
			action: "/services/" + serviceName + "/action",
			method: "POST",
			callbacks: {
				200: function(response) {
					serviceActionsResult._live( serviceName, data, response );
				},
			}
		} )


	}



};


// var $serviceActionsNew = {
//
// 	$cell: true,
// 	id: "serviceActionsNew",
//
// 	_serviceName: null,
// 	_data: null,
//
//
// 	_live: function (serviceName, data) {
//
//
// 		if ( data.variables && data.variables.length ) {
// 			this._serviceName = serviceName;
// 			this._data = data;
// 			this._show();
// 		} else {
// 			var queryString =
// 				"actionator_name=" + encodeURIComponent( data.name );
// 			apiRequest({
// 				action: "/services/" + serviceName + "/action?" + queryString,
// 				method: "POST",
// 				callbacks: {
// 					200: function( response ) {
// 						serviceActionsResult._live( serviceName, data, response )
// 					},
// 				}
// 			});
// 		};
//
// 	},
//
//
// 	_show: function () {
//
// 		var serviceName = this._serviceName;
// 		var data = this._data;
//
// 		modal._live (
// 			{
// 				// dialogClass: "modal-lg",
// 				header: icon ( {
// 					icon: "fa fa-crosshairs",
// 					text: "Service action",
// 				} ),
// 				body: {
// 					$components: [
// 						{ $type: "h4", $text: serviceName },
// 						{ $type: "hr" },
// 						{ $type: "h4", $text: data.label || data.name },
// 						{ $type: "p", $text: data.description },
// 						form( {
// 							components: [
// 								// inDevelopment ? pp(data) : {},
// 								formField( {
// 									type: "hidden",
// 									name: "actionator_name",
// 				    			value: data.name
// 								} ),
// 								{
// 									$components: ( data.variables || [] ).map( function ( variable ) {
// 										variable.name_prefix = "variables";
// 										return enginesField( variable );
// 									} )
// 								},
// 								formCancel ( {
// 									onclick: function () {
// 										serviceActions._live( serviceName );
// 									}
// 								} ),
// 								formSubmit(),
// 							],
// 							action: "/services/" + serviceName + "/action",
// 							method: "POST",
// 							callbacks: {
// 								200: function(response) {
// 									serviceActionsResult._live( serviceName, data, response );
// 								},
// 							}
// 						} )
//
// 					]
// 				}
// 			}
// 		);
//
// 	},
//
// };
