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
				dialogClass: "modal-lg",
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
									appServices._services( "persistent" ),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									appServices._services( "non_persistent" ),
									pp( { object: this._data } )

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
			action: "/apps/" + this._appName + "/services",
			callbacks: {
				200: function(response) {
					$$("#appServicesContent")._refresh( response );
				}
			}
		});

	},


	_services: function ( type ) {
		return {
			$components: appServicesContent._data[ type ].map( function( persistentService ) {
				return button( {
					text: persistentService.label,
					onclick: function () {
						appServicesPersistent._live( appServices._appName, persistentService );
					}
				} );
			} )
		};
	}

};
