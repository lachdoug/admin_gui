var $appServicesPersistentImport = {

	$cell: true,
	id: "appServicesPersistentImport",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


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
					icon: "fa fa-upload",
					text: "App persistent service import data",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentImport._data.label },
								{ $type: "p", $text: appServicesPersistentImport._data.description },
								{ $type: "hr" },
								{
									$components: [
                    appServicesPersistentImport._form()
									],
								},

							],

						},
					]
				}
			}
		);
		// this._load();

  },


	_form: function () {

    var queryString =
			"publisher_namespace=" + encodeURIComponent( this._publisherNamespace ) +
			"&type_path=" + encodeURIComponent( this._typePath ) +
			"&service_handle=" + encodeURIComponent( this._serviceHandle );

		return form ( {
			components: [
				formField( {
					name: "data[file]",
          label: false,
					type: "file",
					required: true,
				} ),
				formField({
					name: "data[write]",
					label: false,
					type: "radio_buttons",
					required: true,
					collection: {
						overwrite: "Overwrite",
						replace: "Replace"
					}
				}),
				// formField( {
				// 	name: "data[service_handle]",
				// 	type: "hidden",
				// 	value: appServicesPersistentImport._data.service_handle
				// } ),
				// {
				// 	$components: appServicesPersistentImportContent._data.map( function( param ) {
				// 		param.name = "data[variables][" + param.name + "]";
				// 		return enginesField( param );
				// 	} )
				// },
				formCancel ( { onclick: () => { appServicesPersistent._live(
					appServicesPersistentImport._appName,
					appServicesPersistentImport._publisherNamespace,
					appServicesPersistentImport._typePath,
					appServicesPersistentImport._serviceHandle );
				} } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/import/?" + queryString,
      enctype: "multipart/form-data",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentImport._appName );
				},
			}
		});
	}

};
