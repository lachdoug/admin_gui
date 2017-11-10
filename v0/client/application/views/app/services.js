var $appServices = {

	$cell: true,
	id: "appServices",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-compass",
					text: "App services",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						button( {
							icon: "fa fa-plus",
							text: "New",
							onclick: () => {
								appServicesNew._live( appName );
							}
						} ),
						{ $type: "hr" },
						{
							id: "appServicesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "label", $text: "Persistent" },
									appServices._persistentServices(),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									appServices._nonpersistentServices(),
									// pp( this._data )

								];
							},

						}
					]
				}
			}
		);
		this._load();

	},


	_load: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services",
			callbacks: {
				200: function(response) {
					appServicesContent._refresh( response );
				}
			}
		});

	},


	_persistentServices: function () {
		var owned = appServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin != "shared" } );
		var shared = appServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin == "shared" } );
		return {
			$components: [
				{ $components: appServices._persistentServicesButtons( owned ) },
				shared.length ? {
					$components: [
						{ $type: "small", $text: "Shared" },
						{ $components: appServices._persistentServicesButtons( shared ) }
					]
				} : {}
			]
		};
	},

	_persistentServicesButtons: function( services ) {
		return services.map( function( service ) {
			return button( {
				text: service.label || service.name,
				// title: service.description || service.label || service.name,
				onclick: function () {
					appServicesPersistent._live(
						appServices._appName,
						service.publisher_namespace,
						service.type_path,
						service.service_handle );
				}
			} );
		} )
	},


	_nonpersistentServices: function () {
		return {
			$components: appServicesContent._data[ "non_persistent" ].map( function( nonpersistentService ) {
				return button( {
					text: nonpersistentService.label || nonpersistentService.name,
					// title: nonpersistentService.description || nonpersistentService.label || nonpersistentService.name,
					onclick: function () {
						appServicesNonpersistent._live(
							appServices._appName,
							nonpersistentService.publisher_namespace,
							nonpersistentService.type_path,
							nonpersistentService.service_handle );
					}
				} );
			} )
		};
	},


};
