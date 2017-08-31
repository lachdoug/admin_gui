// var $appDiagnosticsEnvironment = {
//
// 	$cell: true,
// 	id: "appDiagnosticsEnvironment",
//
// 	_appName: null,
//
//
// 	_live: function (appName) {
//
// 		this._appName = appName;
// 		this._show();
//
// 	},
//
//
// 	_show: function () {
//
// 		var appName = this._appName;
// 		modal._live (
// 			{
// 				dialogClass: "modal-lg",
// 				header: icon ( {
// 					icon: "fa fa-question-circle-o",
// 					text: "App environment",
// 				} ),
// 				body: {
// 					$components: [
// 						{
// 							class: "clearfix",
// 							$components: [
// 								button( {
// 									icon: "fa fa-arrow-up",
// 									wrapperClass: "pull-right",
// 									onclick: function () { appDiagnostics._live( appName ); }
// 								} ),
// 								{ $type: "h4", $text: appName },
// 							]
// 						},
// 						{ $type: "hr" },
// 						button( {
// 							icon: "fa fa-repeat",
// 							text: "Refresh",
// 							onclick: function () { appDiagnosticsEnvironment._live( appName ); }
// 						} ),
// 						{
// 							id: "appDiagnosticsEnvironmentContent",
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
// 								this.$components = [ pp( { object: this._data } ) ];
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
// 			action: "/apps/" + this._appName + "/environment",
// 			callbacks: {
// 				200: function(response) {
// 					$$("#appDiagnosticsEnvironmentContent")._refresh( response );
// 				}
// 			}
// 		});
//
// 	},
//
// };
