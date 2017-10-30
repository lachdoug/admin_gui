var $serviceConfigurationNew = {

	$cell: true,
	id: "serviceConfigurationNew",

	_serviceName: null,
	_data: null,


	_live: function (serviceName, data) {
		var variables = Object.values( data.params );
		if ( variables && variables.length ) {
			this._serviceName = serviceName;
			this._data = data;
			this._show();
		} else {
			var queryString =
				"configurator_name=" + encodeURIComponent( data.name );
			apiRequest({
				action: "/services/" + serviceName + "/configuration?" + queryString,
				method: "POST",
				callbacks: {
					200: function( response ) {
						serviceConfiguration._live( serviceName, data, response )
					},
				}
			});
		};
	},


	_show: function () {

		var serviceName = this._serviceName;
		var data = this._data;

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
						form( {
							components: [
								pp(data),
								formField( {
									type: "hidden",
									name: "configurator_name",
				    			value: data.name
								} ),
								{
									$components: ( Object.values( data.params ) || [] ).map( function ( variable ) {
										variable.name_prefix = "variable";
										return enginesField( variable );
									} )
								},
								formCancel ( {
									onclick: function () {
										serviceConfiguration._live( serviceName );
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
							method: "POST",
							callbacks: {
								200: function(response) {
									alert("Success.");
									serviceConfiguration._live( serviceName );
								},
							}
						} )

					]
				}
			}
		);

	},

};
