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
							icon: "fa fa-file-text-o",
							text: "Logs",
							onclick: function () { appLogs._live(appName); },
						} ),

						button( {
							icon: "fa fa-list-alt",
							text: "Processes",
							onclick: function () { appProcesses._live(appName); },
						} ),

						// { $type: "hr" },
						// button( {
						// 	icon: "fa fa-dot-circle-o",
						// 	text: "Actionators",
						// 	onclick: function () {
						// 		if ( systemApps._dataFor(appName).state == "running" ) {
						// 			appActionators._live(appName);
						// 		} else {
						// 			alert("App must be running to perform actionators.")
						// 		}
						// 	},
						// } ),

						// button( {
						// 	icon: "fa fa-question-circle-o",
						// 	text: "Environment",
						// 	onclick: function () { appDiagnosticsEnvironment._live(appName); },
						// } ),

						{ $type: "hr" },

						button( {
							icon: "fa fa-cube",
							text: "Container",
							onclick: function () { appContainer._live(appName); },
						} ),

						button( {
							icon: "fa fa-compass",
							text: "Services",
							onclick: function () { appDiagnosticsServices._live(appName); },
						} ),

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
