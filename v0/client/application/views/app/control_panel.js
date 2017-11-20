var $appControlPanel = {

	$cell: true,
	id: "appControlPanel",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-cogs",
					text: "App control panel"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appMenu._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							class: "row",
							$components: [
								{
									class: "col-sm-6",
									$components: [
										button( {
											icon: "fa fa-crosshairs",
											text: "Actions",
											onclick: function () {
												// if ( system._appDataFor(appName).state == "running" ) {
													appActions._live(appName);
												// } else {
													// alert("App must be running to perform actions.")
												// };
											},
										} ),
										{ $type: "hr" },
										button( {
											icon: "fa fa-sitemap",
											text: "Network",
											onclick: function () { appNetwork._live(appName); },
										} ),
										button( {
											icon: "fa fa-microchip",
											text: "Memory",
											onclick: function () { appMemory._live(appName); },
										} ),
										{ $type: "hr" },
									]
								},
								{
									class: "col-sm-6",
									$components: [
										button( {
											icon: "fa fa-question-circle-o",
											text: "Environment",
											onclick: function () { appEnvironmentVariables._live(appName); },
										} ),
										button( {
											icon: "fa fa-compass",
											text: "Services",
											onclick: function () { appServices._live(appName); },
										} ),
										{ $type: "hr" },
										button( {
											icon: "fa fa-list-ol",
											text: "Build report",
											onclick: function () { appBuildReport._live(appName); },
										} ),
										button( {
											icon: "fa fa-stethoscope",
											text: "Diagnostics",
											onclick: function () { appDiagnostics._live(appName); },
										} ),
									]
								},
							]
						}
					]
				}
			}
		);

	},

};
