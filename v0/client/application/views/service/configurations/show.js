var $serviceConfigurationsShow = {

	$cell: true,
	id: "serviceConfigurationsShow",

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
			action: "/services/" + this._serviceName + "/configuration?" + queryString,
			// method: "POST",
			callbacks: {
				200: function( response ) {
					serviceConfigurationsShow._show( response )
				},
			}
		});
	},


	// _render: function( data ) {
	// 	var variables = Object.values( data.params );
	// 	if ( variables && variables.length ) {
	// 		this._data = data;
	// 		this._show();
	// 	} else {
	// 		var queryString =
	// 			"configurator_name=" + encodeURIComponent( data.name );
	// 		apiRequest({
	// 			action: "/services/" + this._serviceName + "/configuration?" + queryString,
	// 			method: "POST",
	// 			callbacks: {
	// 				200: function( response ) {
	// 					serviceConfiguration._live( serviceName, data, response )
	// 				},
	// 			}
	// 		});
	// 	};
	// },
	//

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
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceConfigurations._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: data.label },
						{ $type: "p", $text: data.description },
						{ $type: "hr" },
						// pp(data),
						dataList({
							class: "dl-horizontal",
							items: data.variables.map( function( variable ) {
								return { label: variable.label, data: variable.value };
							} )
						}),
						button({
							icon: "fa fa-edit",
							class: "pull-right",
							wrapperClass: "clearfix",
							text: "Edit",
							onclick: function () {
								serviceConfigurationsEdit._live( serviceName, data.name )
							}
						}),
						// pp(data),
						// form( {
						// 	components: [
						// 		pp(data),
						// 		formField( {
						// 			type: "hidden",
						// 			name: "configurator_name",
				    // 			value: data.name
						// 		} ),
						// 		{
						// 			$components: ( Object.values( data.params ) || [] ).map( function ( variable ) {
						// 				variable.name_prefix = "variables";
						// 				return enginesField( variable );
						// 			} )
						// 		},
						// 		formCancel ( {
						// 			onclick: function () {
						// 				serviceConfiguration._live( serviceName );
						// 			}
						// 		} ),
						// 		// {
						// 		// 	$type: 'button',
						// 		// 	type: 'submit',
						// 		// 	$text: "SUBMIT"
						// 		// },
						// 		formSubmit(),
						// 	],
						// 	action: "/services/" + serviceName + "/configuration",
						// 	method: "POST",
						// 	callbacks: {
						// 		200: function(response) {
						// 			alert("Success.");
						// 			serviceConfiguration._live( serviceName );
						// 		},
						// 	}
						// } )

					]
				}
			}
		);

	},

};
