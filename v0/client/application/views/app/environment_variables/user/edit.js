var $appEnvironmentVariablesUserEdit = {

	$cell: true,
	id: "appEnvironmentVariablesUserEdit",

	_appName: null,


	_live: function( appName ) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Edit user environment variables" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesUserEdit._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesUserEditContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									form( {
										components: [
											{
												$components: data.map( function( environment_variable ) {
													return formField( {
														name: "data[" + environment_variable.name + "]",
														label: environment_variable.label,
														value: environment_variable.value
													} );
												} )
											},
											formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesUserEdit._appName ); } } ),
											formSubmit(),
										] ,
										action: "/apps/" + this._appName + "/environment_variables",
										method: "PATCH",
										callbacks: {
											200: function(response) {
												appEnvironmentVariables._live( appEnvironmentVariablesUserEdit._appName );
											},
										}
									} ),
									pp( data )
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
					// debugger;
					appEnvironmentVariablesUserEditContent._refresh( response.user );
				},
			}
		});
	},

};
