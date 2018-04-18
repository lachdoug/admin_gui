var $appEnvironmentVariablesApplication = {

	$cell: true,
	id: "appEnvironmentVariablesApplication",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Environment variables for application" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesApplication._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesApplicationContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									form( {
										components: [
											{
												$components: data.blueprint_environment_variables.map( function( field ) {

													field.value = data.variables.find( function( variable ) { return variable.name == field.name } ).value;
													field.name_prefix = "data";
													return enginesField( field );
												} )
											},
											formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesApplication._appName ); } } ),
											formSubmit(),
										] ,
										action: "/apps/" + this._appName + "/environment_variables",
										method: "PATCH",
										callbacks: {
											200: function(response) {
												appEnvironmentVariables._live( appEnvironmentVariablesUser._appName );
											},
										}
									} ),
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
			action: "/apps/" + this._appName + "/environment_variables",
			callbacks: {
				200: function(response) {
					appEnvironmentVariablesApplicationContent._refresh( response.application );
				},
			}
		});
	},


	_form: function ( data ) {
		components = [];
		for ( var variable in data.software_environment_variables ) {

		};

		return form ( {
			components: [
				formField( {
					name: "data[default_site]",
					label: "Default site",
					hint: "Enter a host name (e.g: www.engines.org )",
					value: data.default_site
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/default_site",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});

	},


};
