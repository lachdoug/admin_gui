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

  },


	_form: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

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
				formCancel ( { onclick: () => { appServicesPersistent._live(
					appServicesPersistentImport._appName,
					appServicesPersistentImport._publisherNamespace,
					appServicesPersistentImport._typePath,
					appServicesPersistentImport._serviceHandle );
				} } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/import/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
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
