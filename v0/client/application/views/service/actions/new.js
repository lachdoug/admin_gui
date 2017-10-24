var $serviceActionsNew = {

	$cell: true,
	id: "serviceActionsNew",

	_serviceName: null,
	_data: null,


	_live: function (serviceName, data) {

		if ( data.variables && data.variables.length ) {
			this._serviceName = serviceName;
			this._data = data;
			this._show();
		} else {
			var queryString =
				"actionator_name=" + encodeURIComponent( data.name );
			apiRequest({
				action: "/services/" + serviceName + "/actions?" + queryString,
				method: "POST",
				callbacks: {
					200: function( response ) {
						serviceActionsResult._live( serviceName, data, response )
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
					text: "Service actions",
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
									name: "actionator_name",
				    			value: data.name
								} ),
								{
									$components: ( data.variables || [] ).map( function ( variable ) {
										variable.name_prefix = "variable";
										return enginesField( variable );
									} )
								},
								formCancel ( {
									onclick: function () {
										serviceActions._live( serviceName );
									}
								} ),
								formSubmit(),
							],
							action: "/services/" + serviceName + "/actions",
							method: "POST",
							callbacks: {
								200: function(response) {
									serviceActionsResult._live( serviceName, data, response );
								},
							}
						} )

					]
				}
			}
		);

	},

};
