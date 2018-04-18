var $appEnvironmentVariablesUserNew = {

	$cell: true,
	id: "appEnvironmentVariablesUserNew",

	_appName: null,


	_live: function( appName ) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "New user environment variable" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesUserNew._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesUserNewContent",
							$components: [
								form( {
									components: [
										formField( {
											name: "data[name]",
											label: "Name"
										} ),
										formField( {
											name: "data[value]",
											label: "Value"
										} ),
										formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesUserNew._appName ); } } ),
										formSubmit(),
									] ,
									action: "/apps/" + this._appName + "/environment_variables",
									method: "POST",
									callbacks: {
										200: function(response) {
											appEnvironmentVariables._live( appEnvironmentVariablesUserNew._appName );
										},
									}
								} ),
							],

						}
					]
				}
			}
		);
	},

};
