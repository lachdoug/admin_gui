var $serviceConfigurationsEdit = {

	$cell: true,
	id: "serviceConfigurationsEdit",

	_serviceName: null,
	_configuratorName: null,
	_data: null,


	_live: function (serviceName, configuratorName) {
		this._serviceName = serviceName;
		this._configuratorName = configuratorName;
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/configuration/edit",
			params: { configurator_name: this._configuratorName },
			callbacks: {
				200: function( response ) {
					serviceConfigurationsEdit._show( response )
				},
			}
		});
	},

	_show: function ( data ) {

		var serviceName = this._serviceName;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service configuration",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label },
						{ $type: "p", $text: data.description },
						form( {
							components: [
								formField( {
									type: "hidden",
									name: "configurator_name",
				    			value: data.name
								} ),
								{
									$components: ( Object.values( data.variables ) || [] ).map( function ( variable ) {
										variable.name_prefix = "variables";
										return enginesField( variable );
									} )
								},
								formCancel ( {
									onclick: function () {
										data.no_save ?
										serviceConfigurations._live( serviceName ) :
										serviceConfigurationsShow._live( serviceName, data.name );
									}
								} ),
								formSubmit(),
							],
							action: "/services/" + serviceName + "/configuration",
							method: "PATCH",
							callbacks: {
								200: function(response) {
									if ( data.no_save ) {
										alert("Successfully applied configuration.");
										serviceConfigurations._live( serviceName );
									} else {
										serviceConfigurationsShow._live( serviceName, data.name );
									};
								},
							}
						} ),

					]
				}
			}
		);

	},

};
