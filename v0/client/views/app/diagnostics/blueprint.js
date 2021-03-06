cell({

	id: "appBlueprint",

	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: false,
					text: "{} App blueprint",
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
							id: "appBlueprintContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( appBlueprintContent._data ) ];
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
			action: "/apps/" + this._appName + "/blueprint",
			callbacks: {
				200: function(response) {
					appBlueprintContent._refresh( response );
				}
			}
		});

	},

});
