var $appActions = {

	$cell: true,
	id: "appActions",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
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
									onclick: function () { appControlPanel._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appActionsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									appActionsContent._data.length ?
										appActionsContent._data.map(
											function( action ) {
												return button( { text: action.label || action.name, onclick: function () { appActionsNew._live( appName, action ) } });
											}
										) : [
										{ $type: "i", $text: "This app does not have any actions." }
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
			action: "/apps/" + this._appName + "/actions",
			callbacks: {
				200: function(response) {
					appActionsContent._refresh( response );
				}
			}
		});

	},

};
