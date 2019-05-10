cell({

	id: "appOperationsNew",

	_live: function (appName, operationName) {

		this._appName = appName;
		this._operationName = operationName;
		this._load();

	},

	_show: function ( data ) {

		var appName = this._appName;
		// var data = this._data;

		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App operation",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						// hasVariables ?
						appOperationsNew._form( data ) // :
						// icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		// if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	// _postWithoutParams: function ( data ) {
	// 	var appName = this._appName;
	// 	apiRequest({
	// 		action: "/apps/" + appName + "/operation",
	// 		params: { operation_name: data.name },
	// 		method: "POST",
	// 		callbacks: {
	// 			200: function( response ) {
	// 				appOperationsResult._live( appName, data, response )
	// 			},
	// 		}
	// 	});
	// },
	//
	// _load: function () {
	// 	apiRequest({
	// 		action: "/apps/" + this._appName + "/operation",
	// 		params: { operation_name: this._operationName },
	// 		callbacks: {
	// 			200: function(response) {
	// 				appOperationsNew._show( response );
	// 			}
	// 		}
	// 	});
	// },
	//
	// _form: function ( data ) {
	//
	// 	var appName = this._appName;
	//
	// 	return form( {
	// 		components: [
	// 			inDevelopment ? pp(data) : {},
	// 			formField( {
	// 				type: "hidden",
	// 				name: "operation_name",
	// 				value: data.name
	// 			} ),
	// 			{
	// 				$components: ( data.variables || [] ).map( function ( variable ) {
	// 					variable.name_prefix = "variables";
	// 					return enginesField( variable );
	// 				} )
	// 			},
	// 			formCancel ( {
	// 				onclick: function () {
	// 					appOperations._live( appName );
	// 				}
	// 			} ),
	// 			formSubmit(),
	// 		],
	// 		action: "/apps/" + appName + "/operation",
	// 		method: "POST",
	// 		callbacks: {
	// 			200: function(response) {
	// 				appOperationsResult._live( appName, data, response );
	// 			},
	// 		}
	// 	} )
	//
	// }


});
