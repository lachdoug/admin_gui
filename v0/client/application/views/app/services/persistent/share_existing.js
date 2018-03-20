var $appServicesPersistentShareExisting = {

	$cell: true,
	id: "appServicesPersistentShareExisting",

	_appName: null,
	_data: null,
	_index: null,


	_live: function( appName, data, index ) {

		this._appName = appName;
		this._data = data;
		this._index = index;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App share existing persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentShareExisting._data.label },
								{ $type: "p", $text: appServicesPersistentShareExisting._data.description },
								{ $type: "hr" },
								appServicesPersistentShareExisting._form(),
							],

						},
					]
				}
			}
		);

	},


	_form: function () {

		var serviceConsumer = this._data.shareable[ this._index ];

		var publisherNamespace = this._data.publisher_namespace;
		var typePath = this._data.type_path;
		var parent = serviceConsumer.parent;
		var serviceHandle = serviceConsumer.service_handle;

		var params = this._data.params.filter( function( param ) {
			return param.immutable != true;
		} ).map( function( param ) {
			param.value = serviceConsumer.variables[ param.name ];
			return param;
		} );

		return form ( {
			components: [
				{ $type: "strong", $text: "Share " + ( serviceConsumer.parent == serviceConsumer.service_handle ? serviceConsumer.parent : serviceConsumer.parent + " - " + serviceConsumer.service_handle ) },
				{ $type: "hr" },
				{
					$components: params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentShareExisting._appName ); } } ),
				formSubmit( params.length > 0 ? {} : { init: function(button) { button.click(); } } ),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/share_existing",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				parent: parent,
				service_handle: serviceHandle
			},
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentShareExisting._appName );
				},
			}
		});
	}

};
