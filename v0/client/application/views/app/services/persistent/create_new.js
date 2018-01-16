var $appServicesPersistentCreateNew = {

	$cell: true,
	id: "appServicesPersistentCreateNew",

	_appName: null,
	_data: null,


	_live: function( appName, data ) {

		this._appName = appName;
		this._data = data;
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
								{ $type: "h4", $text: appServicesPersistentCreateNew._data.label },
								{ $type: "p", $text: appServicesPersistentCreateNew._data.description },
								{ $type: "hr" },
								{
									id: "appServicesPersistentCreateNewContent",
									_data: null,

									$components: [
										icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
									],

									$init: appServicesPersistentCreateNew._load(),

									_refresh: function (data) {
										this._data = data
									},

									$update: function () {
										this.$components = [
											appServicesPersistentCreateNew._form(),
										];
									},

								},

							],

						},
					]
				}
			}
		);
		// this._load();

	},


	_load: function () {

		var params = appServicesPersistentCreateNew._data.params;
		var queryString = params.map( function( param ) {
			return "strings[]=" + ( param.value || '' );
		} ).join("&");

		apiRequest({
			action: "/apps/" + this._appName + "/resolve_strings?" + queryString,
			callbacks: {
				200: function(response) {
					resolvedData = params.map( function( param, i ) {
						param.value = response[i];
						return param;
					} );
					appServicesPersistentCreateNewContent._refresh( resolvedData );
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
					value: appServicesPersistentCreateNew._data.publisher_namespace
				} ),
				formField( {
					name: "type_path",
					type: "hidden",
					value: appServicesPersistentCreateNew._data.type_path
				} ),
				{
					$components: appServicesPersistentCreateNewContent._data.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				pp(appServicesPersistentCreateNewContent._data),
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentCreateNew._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/create_new",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentCreateNew._appName );
				},
			}
		});
	}

};
