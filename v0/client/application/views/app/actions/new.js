var $appActionsNew = {

	$cell: true,
	id: "appActionsNew",

	_appName: null,
	_data: null,


	_live: function (appName, data) {

		if ( data.variables && data.variables.length ) {
			this._appName = appName;
			this._data = data;
			this._show();
		} else {
			var queryString =
				"actionator_name=" + encodeURIComponent( data.name );
			apiRequest({
				action: "/apps/" + appName + "/actions?" + queryString,
				method: "POST",
				callbacks: {
					200: function( response ) {
						appActionsResult._live( appName, data, response )
					},
				}
			});


		};

	},


	_show: function () {

		var appName = this._appName;
		var data = this._data;

		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App actions",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
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
										appActions._live( appName );
									}
								} ),
								formSubmit(),
							],
							action: "/apps/" + appName + "/actions",
							method: "POST",
							callbacks: {
								200: function(response) {
									appActionsResult._live( appName, data, response );
								},
							}
						} )

					]
				}
			}
		);

	},

};
