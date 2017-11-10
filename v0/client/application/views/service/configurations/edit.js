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
		var queryString =
			"configurator_name=" + encodeURIComponent( this._configuratorName );
		apiRequest({
			action: "/services/" + this._serviceName + "/configuration/edit?" + queryString,
			// method: "POST",
			callbacks: {
				200: function( response ) {
					serviceConfigurationsEdit._show( response )
				},
			}
		});
	},


	// _precheck: function( data ) {
	// 	// debugger
	// 	var variables = Object.values( data.params );
	// 	if ( variables && variables.length ) {
	// 		this._data = data;
	// 		this._show();
	// 	} else {
	// 		var queryString =
	// 			"configurator_name=" + encodeURIComponent( data.name );
	// 		apiRequest({
	// 			action: "/services/" + this._serviceName + "/configuration?" + queryString,
	// 			method: "PATCH",
	// 			callbacks: {
	// 				200: function( response ) {
	// 					serviceConfiguration._live( serviceName, data, response )
	// 				},
	// 			}
	// 		});
	// 	};
	// },


	_show: function ( data ) {

		var serviceName = this._serviceName;
		// var data = this._data;

		modal._live (
			{
				// dialogClass: "modal-lg",
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
						{ $type: "hr" },
						form( {
							components: [
								formField( {
									type: "hidden",
									name: "configurator_name",
				    			value: data.name
								} ),
								{
									$components: ( Object.values( data.params ) || [] ).map( function ( variable ) {
										variable.name_prefix = "variables";
										return enginesField( variable );
									} )
								},
								formCancel ( {
									onclick: function () {
										serviceConfigurationsShow._live( serviceName, data.name );
									}
								} ),
								// {
								// 	$type: 'button',
								// 	type: 'submit',
								// 	$text: "SUBMIT"
								// },
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
						// pp(data),


					]
				}
			}
		);

	},

};
