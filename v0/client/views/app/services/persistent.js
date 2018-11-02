var $appServicesPersistent = {

	$cell: true,
	id: "appServicesPersistent",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App persistent service",
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
						{
							id: "appServicesPersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: appServicesPersistent._load,

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {

								var appName = appServicesPersistent._appName;
								var publisherNamespace = appServicesPersistent._publisherNamespace;
								var typePath = appServicesPersistent._typePath;
								var serviceHandle = appServicesPersistent._serviceHandle;

								var immutableParams = this._data.params.filter( function(param) { return param.immutable } );
								var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );

								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									{
										class: "clearfix",
										$components: [
											button( {
												icon: "fa fa-download",
												class: "pull-left-md",
												text: "Export",
												onclick: appServicesPersistent._export
											} ),
											button( {
												icon: "fa fa-upload",
												class: "pull-right-md",
												text: "Import",
												onclick: () => { appServicesPersistentImport._live(
													appName,
													publisherNamespace,
													typePath,
													serviceHandle,
													this._data ); }
											} ),
										]
									},
									{ $type: "hr" },
									{ $type: "label", $text: "Immutable" },
									dataList( { class: "dl-horizontal", items: immutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),
									{ $type: "label", $text: "Mutable" },
									dataList( { class: "dl-horizontal", items: mutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),
									button( {
										icon: "fa fa-edit",
										wrapperClass: "clearfix",
										class: "pull-right-md",
										text: "Edit",
										onclick: () => { appServicesPersistentEdit._live(
											appName,
											publisherNamespace,
											typePath,
											serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									button( {
										icon: "fa fa-trash",
										class: "pull-left-md",
										text: "Delete",
										onclick: function() { appServicesPersistentDelete._live(
											appName,
											publisherNamespace,
											typePath,
											serviceHandle
										) },
									} ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					appServicesPersistentContent._refresh( response );
				}
			}
		});

	},

	_export: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/export",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle,
			},
			filename: `Engines_${
				publisherNamespace }_${
				typePath.replace( /\//g, '_') }_${
				serviceHandle }.data`
		});

	},

};
