var $appServicesPersistentEdit = {

	$cell: true,
	id: "appServicesPersistentEdit",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,
	_data: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App edit persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesPersistentEdit._data.label },
						{ $type: "p", $text: appServicesPersistentEdit._data.description },
						{ $type: "hr" },
						appServicesPersistentEdit._form(),
					]
				}
			}
		);

	},

	_form: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;
		var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );

		return form ( {
			components: [
				{
					$components: mutableParams.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					})
				},
				formCancel ( { onclick: () => {
					appServicesPersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				} } ),
				formSubmit(),
			],

			action: "/apps/" + this._appName + "/service_manager/persistent/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appServicesPersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				}
			}
		});
	}

};
