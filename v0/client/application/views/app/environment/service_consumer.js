var $appEnvironmentServiceConsumer = {

	$cell: true,
	id: "appEnvironmentServiceConsumer",

	_appName: null,


	_live: function (appName, ownerGroup) {

		this._appName = appName;
		this._ownerGroup = ownerGroup
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Environment for application" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentServiceConsumer._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentServiceConsumerContent",
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
					appEnvironmentServiceConsumerContent._refresh( response.service_consumers[ this._ownerGroup ] );
				},
			}
		});
	},

};
