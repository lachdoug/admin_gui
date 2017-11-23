var $appActionsNew = {

	$cell: true,
	id: "appActionsNew",

	_appName: null,
	_data: null,


	_live: function (appName, data) {

		this._appName = appName;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var data = this._data;

		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App action",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						hasVariables ?
						appActionsNew._form() :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams() };

	},


	_postWithoutParams: function () {

		var appName = this._appName;
		var data = this._data;

		var queryString =
			"actionator_name=" + encodeURIComponent( data.name );
		apiRequest({
			action: "/apps/" + appName + "/action?" + queryString,
			method: "POST",
			callbacks: {
				200: function( response ) {
					appActionsResult._live( appName, data, response )
				},
			}
		});
	},

	_form: function () {

		var appName = this._appName;
		var data = this._data;

		return form( {
			components: [
				inDevelopment ? pp(data) : {},
				formField( {
					type: "hidden",
					name: "actionator_name",
					value: data.name
				} ),
				{
					$components: ( data.variables || [] ).map( function ( variable ) {
						variable.name_prefix = "variables";
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
			action: "/apps/" + appName + "/action",
			method: "POST",
			callbacks: {
				200: function(response) {
					appActionsResult._live( appName, data, response );
				},
			}
		} )


	}



};
