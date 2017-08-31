var $appEnvironment = {

	$cell: true,
	id: "appEnvironment",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Environment" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appEnvironment._appName ); }
								} ),
								{ $type: "h4", $text: appEnvironment._appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appEnvironmentContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								debugger;
								this.$components = [
									data.application.variables.length ? button( {
										icon: "fa fa-angle-right",
										text: "Application",
										onclick: () => { appEnvironmentApplication._live( appEnvironment._appName ) }
									} ) : {},
									{ $type: "hr" },
									{ $type: "label", $text: "Services" },
									this._serviceConsumerEnvironments( data ),
								];
							},

							_serviceConsumerEnvironments: function( data ) {
								var components = [];
								for ( var ownerGroup in data.service_consumers ) {
									components.push( button( {
										icon: "fa fa-angle-right",
										text: data.service_consumers[ownerGroup].label,
										onclick: () => { appEnvironmentServiceConsumer._live( appEnvironment._appName, ownerGroup ) }
									} ) );
								};
								return {
									$components: components
								};
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
					appEnvironmentContent._refresh(response);
				},
			}
		});
	},

};
