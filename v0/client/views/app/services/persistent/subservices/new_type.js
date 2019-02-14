var $appServicesPersistentSubservicesNew = {

	$cell: true,
	id: "appServicesPersistentSubservicesNewType",

	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		// this._service_data = service_data;
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
											appServicesPersistentSubservicesNewType._appName,
											appServicesPersistentSubservicesNewType._publisherNamespace,
											appServicesPersistentSubservicesNewType._typePath,
											appServicesPersistentSubservicesNewType._serviceHandle );
									 }
								} ),
								{ $type: "h4", $text: appName },

							]
						},
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

							$init: appServicesPersistentSubservicesNewType._load,

						}




					]
				}
			}
		);

	},

	_load: function () {

// debugger

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/subservices/new_type",
			params: {
				type_path: this._typePath,
				publisher_namespace: this._publisherNamespace,
			},
			callbacks: {
				200: function(response, el) {
					appServicesPersistentSubservicesNewContent.$components = [
						{ $type: "h4", $text: response.service_label },
						{ $type: "p", $text: response.service_description },
						{ $type: "hr" },
						{ $type: "label", $text: "Persistent" },
						pp( response.available_subservices.persistent ),
						{
							$components: response.available_subservices.persistent.map( function( subservice ) {
								// debugger
								return button( {
									text: subservice.service_container,
									onclick: () => {
										let appName = appServicesPersistentSubservicesNewType._appName
										let publisherNamespace = appServicesPersistentSubservicesNewType._publisherNamespace
										let typePath = appServicesPersistentSubservicesNewType._typePath
										let serviceHandle = appServicesPersistentSubservicesNewType._serviceHandle
										let subPublisherNamespace = subservice.publisher_namespace
										let subTypePath = subservice.type_path
										appServicesPersistentSubservicesNew._live(
											appName, publisherNamespace, typePath, serviceHandle, subPublisherNamespace, subTypePath
										);
									}
								} )
							} )
						},
						{ $type: "hr" },
						{ $type: "label", $text: "Non-persistent" },
						pp( response.available_subservices.non_persistent ),
						{
							$components: response.available_subservices.non_persistent.map( function( subservice ) {
								return button( {
									text: subservice.service_container,
									onclick: () => {
										let appName = appServicesPersistentSubservicesNewType._appName
										let publisherNamespace = appServicesPersistentSubservicesNewType._publisherNamespace
										let typePath = appServicesPersistentSubservicesNewType._typePath
										let serviceHandle = appServicesPersistentSubservicesNewType._serviceHandle
										let subPublisherNamespace = subservice.publisher_namespace
										let subTypePath = subservice.type_path
										appServicesPersistentSubservicesNew._live(
											appName, publisherNamespace, typePath, serviceHandle, subPublisherNamespace, subTypePath
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
