var $appServicesPersistentSubservicesNew = {

	$cell: true,
	id: "appServicesPersistentSubservicesNew",

	_live: function( appName, service_data, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = service_data.publisher_namespace;
		this._typePath = service_data.type_path;
		this._serviceHandle = serviceHandle;
		this._service_data = service_data;
		this._show();

	},

	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App persistent service new subservice",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () {
										appServicesPersistent._live(
											appServicesPersistentSubservicesNew._appName,
											appServicesPersistentSubservicesNew._publisherNamespace,
											appServicesPersistentSubservicesNew._typePath,
											appServicesPersistentSubservicesNew._serviceHandle );
									 }
								} ),
								{ $type: "h4", $text: appName },

							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesPersistentSubservicesNew._service_data.label },
						{ $type: "p", $text: appServicesPersistentSubservicesNew._service_data.description },
						{ $type: "hr" },

						pp( this._appName ),
						pp( this._publisherNamespace ),
						pp( this._typePath ),
						pp( this._serviceHandle ),

						{
							id: "appServicesPersistentSubservicesNewContent",
							_service_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: appServicesPersistentSubservicesNew._load,

						}




					]
				}
			}
		);

	},

	_load: function () {

// debugger

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/subservices/available",
			params: {
				type_path: this._typePath,
			},
			callbacks: {
				200: function(response, el) {

					appServicesPersistentSubservicesNewContent.$components = [
						{ $type: "label", $text: "Persistent" },
						pp( response["persistent"] ),
						// response["persistent"].map( function() {
						//
						// } ),
						{ $type: "hr" },
						{ $type: "label", $text: "Non-persistent" },
						pp( response["non_persistent"] ),
						{
							$components: response["non_persistent"].map( function( subservice ) {
								// debugger
								return button( {
									text: subservice.service_container,
									onclick: () => {
										let appName = appServicesPersistentSubservicesNew._appName
										let publisherNamespace = appServicesPersistentSubservicesNew._publisherNamespace
										let typePath = appServicesPersistentSubservicesNew._typePath
										let serviceHandle = appServicesPersistentSubservicesNew._serviceHandle
										let service_data = appServicesPersistentSubservicesNew._service_data
										appServicesPersistentSubservicesNewSubservice._live(
											appName, service_data, serviceHandle, subservice
										);
									}
								} )
							} )
						},
					]

				}
			}
		});



	},

	// _form: function () {
	//
	// 	var appName = this._appName;
	// 	var publisherNamespace = this._publisherNamespace;
	// 	var typePath = this._typePath;
	// 	var serviceHandle = this._serviceHandle;
	// 	var mutableParams = this._service_data.params.filter( function(param) { return param.immutable != true } );
	//
	// 	return form ( {
	// 		components: [
	// 			{
	// 				$components: mutableParams.map( function( field ) {
	// 					field.name_prefix = "data[variables]";
	// 					return enginesField( field );
	// 				})
	// 			},
	// 			formCancel ( { onclick: () => {
	// 				appServicesPersistent._live(
	// 					appName, publisherNamespace, typePath, serviceHandle
	// 				);
	// 			} } ),
	// 			formSubmit(),
	// 		],
	//
	// 		action: "/apps/" + this._appName + "/service_manager/persistent/",
	// 		params: {
	// 			publisher_namespace: publisherNamespace,
	// 			type_path: typePath,
	// 			service_handle: serviceHandle
	// 		},
	// 		method: 'PUT',
	// 		callbacks: {
	// 			200: function(response) {
	// 				appServicesPersistent._live(
	// 					appName, publisherNamespace, typePath, serviceHandle
	// 				);
	// 			}
	// 		}
	// 	});
	// }

};
