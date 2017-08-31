var $appDiagnostics = {

	$cell: true,
	id: "appDiagnostics",

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
					icon: "fa fa-stethoscope",
					text: "App diagnostics"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },

						button( {
							icon: "fa fa-cube",
							text: "Container",
							onclick: function () { appContainer._live(appName); },
						} ),

						button( {
							icon: "fa fa-file-text-o",
							text: "Logs",
							onclick: function () { appLogs._live(appName); },
						} ),

						button( {
							icon: "fa fa-list-alt",
							text: "Processes",
							onclick: function () { appProcesses._live(appName); },
						} ),

						// button( {
						// 	icon: "fa fa-question-circle-o",
						// 	text: "Environment",
						// 	onclick: function () { appDiagnosticsEnvironment._live(appName); },
						// } ),

						{ $type: "hr" },

						button( {
							icon: "fa fa-compass",
							text: "Consumed services",
							onclick: function () { appConsumedServices._live(appName); },
						} ),

						button( {
							icon: "fa fa-plus",
							text: "Available services",
							onclick: function () { appAvailableServices._live(appName); },
						} ),

						{ $type: "hr" },

						button( {
							icon: false,
							text: "{} Blueprint",
							onclick: function () { appBlueprint._live(appName); },
						} ),

					]
				}
			}
		);

	},

};
