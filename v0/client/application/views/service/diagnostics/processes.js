var $serviceProcesses = {

	$cell: true,
	id: "serviceProcesses",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-list-ol",
					text: "Service diagnostics processes",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceDiagnostics._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						button( {
							icon: "fa fa-repeat",
							text: "Refresh",
							onclick: function () { serviceProcesses._live( serviceName ); }
						} ),
						{
							id: "serviceProcessesContent",
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
								// 	report = { $type: "i", $text: "This service does not have a build report." };
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
												// pp( serviceProcessesContent._data )
												{
													$type: "thead",
													$components: [
														{
															$type: "tr",
															$components: serviceProcessesContent._data.Titles.map( function (title) {
																return { $type: "th", $text: title};
															} )
														}
													]
												},
												{
													$type: "tbody",
													$components: serviceProcessesContent._data.Processes.map( function (process) {
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
			action: "/services/" + this._serviceName + "/processes",
			callbacks: {
				200: function(response) {
					serviceProcessesContent._refresh( response );
				}
			}
		});

	},

};
