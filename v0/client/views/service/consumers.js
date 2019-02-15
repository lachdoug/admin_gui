cell({

	id: "serviceConsumers",

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
					icon: "fa fa-map-signs",
					text: "Service consumers",
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
						dataLoader({
							action: "/services/" + serviceName + "/consumers",
							render: function( response ) {
								return {
									$components: response.length === 0 ? [ {
										$type: 'i', $text: 'None'
									} ] : response.map( function( consumer ) {
										// return pp( consumer )
										return button( {
											text: `${consumer.parent_engine} ${serviceName}:${consumer.service_handle}`,
											icon: "fa fa-external-link-square",
											onclick: function () {
												consumer.container_type === 'app' ?
												consumer.persistent ?
												appServicesPersistent._live(
													consumer.parent_engine,
													consumer.publisher_namespace,
													consumer.type_path,
													consumer.service_handle
												) :
												appServicesNonpersistent._live(
													consumer.parent_engine,
													consumer.publisher_namespace,
													consumer.type_path,
													consumer.service_handle
												) :
												consumer.persistent ?
												serviceServicesPersistent._live(
													consumer.parent_engine,
													consumer.publisher_namespace,
													consumer.type_path,
													consumer.service_handle
												) :
												serviceServicesNonpersistent._live(
													consumer.parent_engine,
													consumer.publisher_namespace,
													consumer.type_path,
													consumer.service_handle
												)

											}
										} )
									} )
								}
							}
						})

					]
				}
			}
		);

	},

});
