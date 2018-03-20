var $appServicesPersistentNewType = {

	$cell: true,
	id: "appServicesPersistentNewType",

	_appName: null,
	_publisherNamespace: null,
	_persistentService: null,


	_live: function( appName, publisherNamespace, typePath ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-plus",
					text: "App new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							id: "appServicesPersistentNewTypeContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: function () { appServicesPersistentNewType._load() },

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									appServicesPersistentNewType._form(),
									// pp( this._data ),
								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/available",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
			},
			callbacks: {
				200: function(response) {
					appServicesPersistentNewTypeContent._refresh( response );
				}
			}
		});

	},


	_form: function () {

		return form ( {
			components: [
				formField( {
					name: "data[create_type]",
					id: "appServicesPersistentNewTypeCreateType",
					label: false,
					title: "Create type",
					type: "select",
					value: "create",
					collection: serviceConsumerCreateType( appServicesPersistentNewTypeContent._data )
				} ),
				(
					appServicesPersistentNewTypeContent._data.shareable == 0 ? {} :
					formField( {
						name: "data[shareable_service]",
						label: false,
						type: "select",
						collection: appServicesPersistentNewTypeContent._data.shareable.map(
							function( service, i ) {
								return [ i,	service.parent + (
										service.parent == service.service_handle ? "" :
										" - " + service.service_handle
									)
								];
							}
						),
						dependOn: {
							input: "appServicesPersistentNewTypeCreateType",
							value: "share"
						}
					} )
				),


				// _formAvailableServiceOption: function( availableService ) {
				// 	var parent = availableService.parent;
				// 	var serviceHandle = availableService.service_handle;
				// 	var optionValue = parent + "#" + serviceHandle;
				// 	var optionLabel = ( parent + ( parent == serviceHandle ? "" : " - " + serviceHandle ) );
				// 	return [ optionValue, optionLabel ];
				// }




				(
					appServicesPersistentNewTypeContent._data.adoptable == 0 ? {} :
					formField( {
						name: "data[adoptable_service]",
						label: false,
						type: "select",
						collection: appServicesPersistentNewTypeContent._data.adoptable.map(
							function( service, i ) {
								return [ i,	service.parent + (
										service.parent == service.service_handle ? "" :
										" - " + service.service_handle
									)
								];
							}
						),
						dependOn: {
							input: "appServicesPersistentNewTypeCreateType",
							value: "adopt"
						}
					} )
				),
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentNewType._appName ); } } ),
				formSubmit( {
					text: "Next",
					icon: "fa fa-arrow-right",
				}),
			],
			init: function ( form ) {
				$(form).submit( function( e ) {

					var formData = new FormData( form );
					var serviceConsumerParams = appServicesPersistentNewTypeContent._data.params;
					switch ( formData.get("data[create_type]") ) {
						case "create":
							appServicesPersistentCreateNew._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data
							);
							break;
						case "share":
							appServicesPersistentShareExisting._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data,
								parseInt( formData.get("data[shareable_service]") )
							);
							break;
						case "adopt":
							appServicesPersistentAdoptOrphan._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data,
								parseInt( formData.get("data[adoptable_service]") )
							);
							break;
					};
					e.preventDefault();
					return false;
				} );
			},

		} );
	}

};
