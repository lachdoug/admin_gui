// var $serviceAvailableServices = {
//
// 	$cell: true,
// 	id: "serviceAvailableServices",
//
// 	_serviceName: null,
//
//
// 	_live: function (serviceName) {
//
// 		this._serviceName = serviceName;
// 		this._show();
//
// 	},
//
//
// 	_show: function () {
//
// 		var serviceName = this._serviceName;
// 		modal._live (
// 			{
// 				dialogClass: "modal-lg",
// 				header: icon ( {
// 					icon: "fa fa-plus",
// 					text: "Service available services",
// 				} ),
// 				body: {
// 					$components: [
// 						{
// 							class: "clearfix",
// 							$components: [
// 								button( {
// 									icon: "fa fa-arrow-up",
// 									wrapperClass: "pull-right",
// 									onclick: function () { serviceDiagnostics._live( serviceName ); }
// 								} ),
// 								{ $type: "h4", $text: serviceName },
// 							]
// 						},
// 						{ $type: "hr" },
// 						{
// 							id: "serviceAvailableServicesContent",
// 							_data: null,
//
// 							$components: [
// 								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
// 							],
//
// 							_refresh: function (data) {
// 								this._data = data
// 							},
//
// 							$update: function () {
// 								this.$components = [ pp( serviceAvailableServicesContent._data ) ];
// 							},
//
// 						}
// 					]
// 				}
// 			}
// 		);
// 		this._load();
//
// 	},
//
//
// 	_load: function () {
//
// 		apiRequest({
// 			action: "/services/" + this._serviceName + "/available_services",
// 			callbacks: {
// 				200: function(response) {
// 					serviceAvailableServicesContent._refresh( response );
// 				}
// 			}
// 		});
//
// 	},
//
// };
