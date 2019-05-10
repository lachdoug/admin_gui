var $appActionators = {

	$cell: true,
	id: "appActionators",

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
					icon: "fa fa-dot-circle-o",
					text: "App actions",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appDiagnostics._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appActionatorsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									appActionatorsContent._data.length ?
										appActionatorsContent._data.map(
											function( actionator ) {
												return button( { text: actionator.label || actionator.name, onclick: function () { appActionatorsNew._live( appName, actionator.name ) } });
											}
										) : [
											{ $type: "i", $text: "This app does not have any actionators." }
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

		apiRequest( {
			action: "/apps/" + this._appName + "/actionators",
			callbacks: {
				200: function(response) {
					appActionatorsContent._refresh( response );
				}
			}
		});

	},

};
