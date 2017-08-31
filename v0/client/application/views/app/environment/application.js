var $appEnvironmentApplication = {

	$cell: true,
	id: "appEnvironmentApplication",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Environment for application" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentApplication._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentApplicationContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									pp( { object: data} )
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
			action: "/apps/" + this._appName + "/environment",
			callbacks: {
				200: function(response) {
					appEnvironmentApplicationContent._refresh( response.application );
				},
			}
		});
	},

};
