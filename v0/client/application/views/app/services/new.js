var $appServicesNew = {

	$cell: true,
	id: "appServicesNew",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App new service",
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
							id: "appServicesNewContent",
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
									appServicesNew._services( "persistent" ),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									appServicesNew._services( "non_persistent" ),
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
			action: "/apps/" + this._appName + "/service_manager/available",
			callbacks: {
				200: function(response) {
					appServicesNewContent._refresh( response );
				}
			}
		});

	},


	_services: function ( type ) {
		return {
			$components: appServicesNewContent._data[ type ].map( function( service ) {
				return button( {
					text: service.label,
					onclick: function () {
						if ( type == "persistent") {
							appServicesPersistentNewType._live(
								appServicesNew._appName,
								service.publisher_namespace,
								service.type_path );
						} else {
							appServicesNonpersistentNew._live(
								appServicesNew._appName,
								service.publisher_namespace,
								service.type_path );
						}
					}
				} );
			} )
		};
	}

};
