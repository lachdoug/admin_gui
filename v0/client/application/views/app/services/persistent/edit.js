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

		var appName = appServicesPersistentEdit._appName;
		var publisherNamespace = appServicesPersistentEdit._publisherNamespace;
		var typePath = appServicesPersistentEdit._typePath;
		var serviceHandle = appServicesPersistentEdit._serviceHandle;
		var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );
		var queryString = "publisher_namespace=" + encodeURIComponent( this._publisherNamespace ) + "&type_path=" + encodeURIComponent( this._typePath ) + "&service_handle=" + encodeURIComponent( this._serviceHandle );

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

			action: "/apps/" + this._appName + "/service_manager/persistent/?" + queryString,
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
