var $appServicesNonpersistentEdit = {

	$cell: true,
	id: "appServicesNonpersistentEdit",

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
					text: "App non-persistent service",
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
						{ $type: "h4", $text: appServicesNonpersistentEdit._data.label },
						{ $type: "p", $text: appServicesNonpersistentEdit._data.description },
						{ $type: "hr" },
						appServicesNonpersistentEdit._form(),
					]
				}
			}
		);

	},

	_form: function () {

		var appName = appServicesNonpersistentEdit._appName;
		var publisherNamespace = appServicesNonpersistentEdit._publisherNamespace;
		var typePath = appServicesNonpersistentEdit._typePath;
		var serviceHandle = appServicesNonpersistentEdit._serviceHandle;
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
					appServicesNonpersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				} } ),
				formSubmit(),
			],

			action: "/apps/" + this._appName + "/service_manager/nonpersistent/?" + queryString,
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appServicesNonpersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				}
			}
		});
	}

};
