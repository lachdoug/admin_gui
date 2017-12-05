var $appActionsNew = {

	$cell: true,
	id: "appActionsNew",

	// _appName: null,
	// _data: null,


	_live: function (appName, actionName) {

		this._appName = appName;
		this._actionName = actionName;
		this._load();

	},


	_show: function ( data ) {

		var appName = this._appName;
		// var data = this._data;

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
						appActionsNew._form( data ) :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	_postWithoutParams: function ( data ) {

		var appName = this._appName;
		// var data = this._data;

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

	_load: function () {
		var queryString =
			"actionator_name=" + encodeURIComponent( this._actionName );
		apiRequest({
			action: "/apps/" + this._appName + "/action?" + queryString,
			callbacks: {
				200: function(response) {
					appActionsNew._show( response );
				}
			}
		});
	},

	_form: function ( data ) {

		var appName = this._appName;
		// var data = this._data;

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
