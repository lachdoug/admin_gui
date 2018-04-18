var $appServicesNonpersistentNew = {

	$cell: true,
	id: "appServicesNonpersistentNew",

	_appName: null,

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
				header: icon ( {
					icon: "fa fa-plus",
					text: "App create new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{
									id: "appServicesNonpersistentNewContent",
									_data: null,

									$components: [
										icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
									],

									$init: appServicesNonpersistentNew._load(),

									_refresh: function (data) {
										this._data = data
									},

									$update: function () {
										this.$components = [
											{ $type: "h4", $text: appServicesNonpersistentNewContent._data.label },
											{ $type: "p", $text: appServicesNonpersistentNewContent._data.description },
											{ $type: "hr" },
											appServicesNonpersistentNew._form(),
										];
									},

								},

							],

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
			action: "/apps/" + this._appName + "/service_manager/nonpersistent/new",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath
			},
			callbacks: {
				200: function(response) {
					appServicesNonpersistentNewContent._refresh( response );
				}
			}
		});

	},


	_form: function () {
		return form ( {
			components: [
				formField( {
					name: "publisher_namespace",
					type: "hidden",
					value: appServicesNonpersistentNewContent._data.publisher_namespace
				} ),
				formField( {
					name: "type_path",
					type: "hidden",
					value: appServicesNonpersistentNewContent._data.type_path
				} ),
				{
					$components: appServicesNonpersistentNewContent._data.params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesNonpersistentNew._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/nonpersistent/",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesNonpersistentNew._appName );
				},
			}
		});
	}

};
