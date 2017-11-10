var $serviceServices = {

	$cell: true,
	id: "serviceServices",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service services",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceServicesContent",
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
									serviceServices._persistentServices(),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									serviceServices._nonpersistentServices(),
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
			action: "/services/" + this._serviceName + "/service_manager/services",
			callbacks: {
				200: function(response) {
					serviceServicesContent._refresh( response );
				}
			}
		});

	},


	_persistentServices: function () {
		var owned = serviceServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin != "shared" } );
		var shared = serviceServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin == "shared" } );
		return {
			$components: [
				{ $components: serviceServices._persistentServicesButtons( owned ) },
				shared.length ? {
					$components: [
						{ $type: "small", $text: "Shared" },
						{ $components: serviceServices._persistentServicesButtons( shared ) }
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
					serviceServicesPersistent._live(
						serviceServices._serviceName,
						service.publisher_namespace,
						service.type_path,
						service.service_handle );
				}
			} );
		} )
	},


	_nonpersistentServices: function () {
		return {
			$components: serviceServicesContent._data[ "non_persistent" ].map( function( nonpersistentService ) {
				return button( {
					text: nonpersistentService.label || nonpersistentService.name,
					// title: nonpersistentService.description || nonpersistentService.label || nonpersistentService.name,
					onclick: function () {
						serviceServicesNonpersistent._live(
							serviceServices._serviceName,
							nonpersistentService.publisher_namespace,
							nonpersistentService.type_path,
							nonpersistentService.service_handle );
					}
				} );
			} )
		};
	},


};
