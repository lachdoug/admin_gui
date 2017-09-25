// var $appEnvironmentVariablesServiceConsumer = {
//
// 	$cell: true,
// 	id: "appEnvironmentVariablesServiceConsumer",
//
// 	_appName: null,
// 	_ownerGroup: null,
//
//
// 	_live: function (appName, ownerGroup) {
//
// 		this._appName = appName;
// 		this._ownerGroup = ownerGroup
// 		this._show();
//
// 	},
//
//
// 	_show: function () {
// 		modal._live(
// 			{
// 				header: icon( { icon: "fa fa-question-circle-o", text: "Environment variables for application service" } ),
// 				body: {
// 					$components: [
// 						{ $type: "h4", $text: appEnvironmentVariablesServiceConsumer._appName },
// 						{ $type: "hr" },
// 						{
// 							id: "appEnvironmentVariablesServiceConsumerContent",
// 							$components: [
// 								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
// 							],
// 							_refresh: function ( data ) {
// 								this.$components = [
// 									form( {
// 										components: [
// 											{
// 												$components: data.consumer_params.filter( function ( consumer_param ) {
// 													return consumer_param.immutable != true;
// 												} ).map( function( consumer_param ) {
// 													return enginesField( consumer_param );
// 												} )
// 											},
// 											data.consumer_params.map( function( consumer_param ) {
// 												return enginesField( $.extend(
// 													consumer_param,
// 													{
// 														value: data.variables.find(
// 															function( variable ) {
// 																return variable.name == consumer_param.name
// 															}
// 														)
// 													}
// 												) );
// 											} ),
// 											formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesServiceConsumer._appName ); } } ),
// 											formSubmit(),
// 										] ,
// 										action: "/apps/" + this._appName + "/environment_variables",
// 										method: "PATCH",
// 										callbacks: {
// 											200: function(response) {
// 												appEnvironmentVariables._live( appEnvironmentVariablesUser._appName );
// 											},
// 										}
// 									} ),
// 									pp( data )
// 								];
// 							},
//
// 						}
// 					]
// 				}
// 			}
// 		);
// 		this._load();
// 	},
//
//
// 	_load: function () {
// 		apiRequest({
// 			action: "/apps/" + this._appName + "/environment_variables",
// 			callbacks: {
// 				200: function(response) {
// 					debugger;
// 					appEnvironmentVariablesServiceConsumerContent._refresh( response.service_consumers[ appEnvironmentVariablesServiceConsumer._ownerGroup ] );
// 				},
// 			}
// 		});
// 	},
//
// };
