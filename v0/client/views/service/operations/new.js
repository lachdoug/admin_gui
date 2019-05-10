// cell({
//
// 	id: "serviceOperationsNew",
//
// 	_live: function (serviceName, operationName) {
//
// 		this._serviceName = serviceName;
// 		this._operationName = operationName;
// 		this._load();
//
// 	},
//
// 	_show: function ( data ) {
//
// 		this._data = data
//
// 		var serviceName = this._serviceName;
//
// 		var hasVariables = data.variables && data.variables.length;
//
// 		modal._live (
// 			{
// 				header: icon ( {
// 					icon: "fa fa-crosshairs",
// 					text: "Service operation",
// 				} ),
// 				body: {
// 					$components: [
// 						{ $type: "h4", $text: serviceName },
// 						{ $type: "hr" },
// 						{ $type: "h4", $text: data.label || data.name },
// 						{ $type: "p", $text: data.description },
//
// 						serviceOperationsNew._content(),
// 						// hasVariables ?
// 						// icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
// 					]
// 				}
// 			}
// 		);
//
// 		// if ( !hasVariables ) { this._postWithoutParams( data ) };
//
// 	},
//
// 	_content: function() {
//
// 		let performAction = function( resolve, reject, actionator_name, actionator_params ) {
//
// 			apiRequest({
// 				action: "/services/" + this._serviceName + "/actionator",
// 				params: {
// 					actionator_name: actionator_name,
// 					variables: actionator_params,
// 				},
// 				callbacks: {
// 					200: function(response) {
// 						resolve(response);
// 					}
// 				}
// 			});
//
// 		},
//
// 		return {
// 			id: "serviceOperationsNewContent",
// 			$init: function() {
//
// 				let data = serviceOperationsNew._data
//
// 				let data_sources = data.data || []
//
// 				let promises = []
//
// 				data_sources.forEach( function( data_source ) {
// 					promises.push(
// 						new Promise(function( resolve, reject ){
//
// 							if( data_source.type == "action" ) {
// 								performAction( resolve, reject, data_source.action, data_source.params )
// 							}
//
// 						})
// 					)
// 				} )
//
//
// 				Promise.all( promises ).then(function(values){
//
//
// 					debugger
//
//
// 				//Here we will get values of p1, p2
//
// 				// serviceOperationsNew._form( data ) // :
//
//
// 				});
//
// 			},
// 			$components: [
// 				{ icon: "fa fa-spinner fa-spin", text: "Loading" }
// 			]
// 		}
//
//
// 	 },
//
// 	_postWithoutParams: function ( data ) {
// 		var serviceName = this._serviceName;
// 		apiRequest({
// 			action: "/services/" + serviceName + "/operation",
// 			params: { operation_name: data.name },
// 			method: "POST",
// 			callbacks: {
// 				200: function( response ) {
// 					serviceOperationsResult._live( serviceName, data, response )
// 				},
// 			}
// 		});
// 	},
//
// 	_load: function () {
// 		apiRequest({
// 			action: "/services/" + this._serviceName + "/operation",
// 			params: { operation_name: this._operationName },
// 			callbacks: {
// 				200: function(response) {
// 					serviceOperationsNew._show( response );
// 				}
// 			}
// 		});
// 	},
//
// 	_form: function ( data ) {
//
// 		var serviceName = this._serviceName;
//
// 		return form( {
// 			components: [
// 				inDevelopment ? pp(data) : {},
// 				formField( {
// 					type: "hidden",
// 					name: "operation_name",
// 					value: data.name
// 				} ),
// 				{
// 					$components: ( data.variables || [] ).map( function ( variable ) {
// 						variable.name_prefix = "variables";
// 						return enginesField( variable );
// 					} )
// 				},
// 				formCancel ( {
// 					onclick: function () {
// 						serviceOperations._live( serviceName );
// 					}
// 				} ),
// 				formSubmit(),
// 			],
// 			action: "/services/" + serviceName + "/operation",
// 			method: "POST",
// 			callbacks: {
// 				200: function(response) {
// 					serviceOperationsResult._live( serviceName, data, response );
// 				},
// 			}
// 		} )
//
// 	}
//
//
// });
