cell({

	id: "appLogs",


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
					icon: "fa fa-list-ol",
					text: "App diagnostics logs",
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
						button( {
							icon: "fa fa-repeat",
							text: "Refresh",
							onclick: function () { appLogs._live( appName ); }
						} ),
						{
							id: "appLogsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ this._logs() ];
							},

							_logs: function () {
								return tabs({
									items: [
										{ label: "Output", body: { $type: "pre", style: "white-space: pre-wrap;", $text: appLogsContent._data.stdout } },
										{ label: "Error", body: { $type: "pre", style: "white-space: pre-wrap;", $text: appLogsContent._data.stderr } }
									]
								});
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
			action: "/apps/" + this._appName + "/logs",
			callbacks: {
				200: function(response) {
					appLogsContent._refresh( response );
				}
			}
		});

	},

});
