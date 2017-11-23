var $serviceActionsNew = {

	$cell: true,
	id: "serviceActionsNew",

	_serviceName: null,
	_data: null,


	_live: function (serviceName, data) {

		this._serviceName = serviceName;
		this._data = data;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		var data = this._data;

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
						serviceActionsNew._form() :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams() };

	},


	_postWithoutParams: function () {

		var serviceName = this._serviceName;
		var data = this._data;

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

	_form: function () {

		var serviceName = this._serviceName;
		var data = this._data;

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
