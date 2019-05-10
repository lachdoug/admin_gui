var $appOperations = {

	$cell: true,
	id: "appOperations",

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
					icon: "fa fa-crosshairs",
					text: "App operations",
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
							id: "appOperationsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									appOperationsContent._data.length ?
										appOperationsContent._data.map(
											function( operation ) {
												return button( { text: operation.label || operation.name, onclick: function () { appOperationsNew._live( appName, operation.name ) } });
											}
										) : [
											{ $type: "i", $text: "This app does not have any operations." }
										];
							},
						},
					]
				}
			}
		);
		this._load();

	},

	_load: function () {

		apiRequest( {
			action: "/apps/" + this._appName + "/operations",
			callbacks: {
				200: function(response) {
					appOperationsContent._refresh( response );
				}
			}
		});

	},

};
