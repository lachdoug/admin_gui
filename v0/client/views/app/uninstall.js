var $appUninstall = {

	$cell: true,
	id: "appUninstall",
	_appName: null,


	_live: function (appName) {
		this._appName = appName;
		this._show();
	},


	_show: function () {

		var appName = this._appName;
		modal._live(
			{
				header: icon ( {
					icon: "fa fa-minus-square",
					text: "App uninstall"
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						form( {
							components: [
								formField( {
									type: "checkbox",
									name: "data[delete_app_data]",
									id: "appUninstallField_delete_app_data",
									label: "Delete app data",
									class: "text-center"
								} ),
								formCancel ( {
									onclick: function () {
										appMenu._live(appName);
									}
								} ),
								formSubmit(),
							],
							action: "/apps/" + appName + "/uninstall",
							callbacks: {
								200: function(response) {
									systemApps._load();
									modal._kill();
								},
							}
						} )
					]
				}
			}
		);
	},

};
