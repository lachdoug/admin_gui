var $appBuildReport = {

	$cell: true,
	id: "appBuildReport",

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
					icon: "fa fa-list-ol",
					text: "App build report",
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
						{
							id: "appBuildReportDisplay",
							_buildReport: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],
							_refresh: function (buildReport) {
								this._buildReport = buildReport.replace(/^\s+|\s+$/g, ''); // remove leading and trailing whitespace characters
							},
							$update: function () {
								var report = "";
								if ( this._buildReport == "" ) {
									report = { $type: "i", $text: "This app does not have a build report." };
								} else {
									report = markdown( this._buildReport );
								}
								this.$components = [ report ];
							}
						}
					]
				}
			}
		);
		this._load();

	},


	_load: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/build_report",
			callbacks: {
				200: function(response) {
					$$("#appBuildReportDisplay")._refresh( response.build_report );
				}
			}
		});

	},

};
