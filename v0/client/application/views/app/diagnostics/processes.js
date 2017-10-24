var $appProcesses = {

	$cell: true,
	id: "appProcesses",

	_appName: null,


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
					text: "App diagnostics processes",
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
							onclick: function () { appProcesses._live( appName ); }
						} ),
						{
							id: "appProcessesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								// var report = "";
								// if ( this._processes == "" ) {
								// 	report = { $type: "i", $text: "This app does not have a build report." };
								// } else {
								// 	report = markdown( this._processes );
								// }
								this.$components = [ this._processes() ];
							},

							_processes: function () {
								return {
									class: "well",
									style: "font-family: monospace; box-shadow: none; background-image: none;",
									$components: [
										{
											$type: "table",
											class: "table",
											$components: [
												// pp( appProcessesContent._data )
												{
													$type: "thead",
													$components: [
														{
															$type: "tr",
															$components: appProcessesContent._data.Titles.map( function (title) {
																return { $type: "th", $text: title};
															} )
														}
													]
												},
												{
													$type: "tbody",
													$components: appProcessesContent._data.Processes.map( function (process) {
														return {
															$type: "tr",
															$components: process.map( function(datum) {
																return {
																	$type: "td",
																	$text: datum
																};
															} )
														};
													} )
												}
											]
										}
									]
								};
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
			action: "/apps/" + this._appName + "/processes",
			callbacks: {
				200: function(response) {
					appProcessesContent._refresh( response );
				}
			}
		});

	},

};
