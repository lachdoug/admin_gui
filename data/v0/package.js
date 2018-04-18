cell({

	id: "fatalError",

	_live: function (error) {

		modal._live ( {
			header: icon( { icon: "fa fa-bug", text: "Bug" } ),
			body: {
				$components: [
					{
						$type: "p",
						$text: "Sorry, you have encountered a bug in Engines."
					},
					{
						class: "clearfix",
						$components: [
							button( { onclick: "$('#fatalErrorDetail').toggle();", wrapperClass: "pull-left",
												icon: "fa fa-info", text: "Detail", title: "Error detail" } ),
							button( { onclick: modal._kill, wrapperClass: "pull-right",
												icon: "fa fa-times", text: "No thanks" } ),
							{
								$type: 'form',
								$init: function() {
									$(this).submit(function(e) {
										$.ajax({
						           type: "POST",
						           url: bugReportsUrl,
											 dataType : 'json',
						           data: error,
										   complete: function() {
												 modal._kill();
											 }
						        });
								    e.preventDefault();
									});
								},
								$components: [
									{
										$type: 'button',
										type: 'submit',
										title: 'Send report',
										class: 'btn btn-custom btn-lg pull-right',
										$components: [
											icon( {
												icon: 'fa fa-paper-plane-o',
												text: "Send report"
											} )
										]
									}
								]
							},
						]
					},
					{
						id: "fatalErrorDetail",
						style: "display: none;",
						$components: [ pp(error) ] },
				]
			}
		} );

	}

});

cell({

	id: "serviceActions",

	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service actions",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceActionsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceActionsContent._data.length ?
										serviceActionsContent._data.map(
											function( action ) {
												return button( { text: action.label || action.name, onclick: function () { serviceActionsNew._live( serviceName, action.name ) } });
											}
										) : [
										{ $type: "i", $text: "This service does not have any actions." }
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

		apiRequest({
			action: "/services/" + this._serviceName + "/actions",
			callbacks: {
				200: function(response) {
					serviceActionsContent._refresh( response );
				}
			}
		});

	},

});

var $serviceWebsites = {

	$cell: true,
	id: "serviceWebsites",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-globe",
					text: "Service websites"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceMenu._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceWebsitesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								this.$components = data.length ?
									data.map( ( website ) => { return button( { text: website, onclick: function() {
										openUrl( website );
									} } ); } ) :
									[ { $type: "i", $text: "None." } ]
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/services/" + this._serviceName + "/websites",
			callbacks: {
				200: function( data ) {
					serviceWebsitesContent._refresh( data );
				},
			}
		});
	},

};

var $serviceServiceDefinition = {

	$cell: true,
	id: "serviceServiceDefinition",

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
					icon: false,
					text: "{} Service definition",
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
						{
							id: "serviceServiceDefinitionContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( serviceServiceDefinitionContent._data ) ];
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
			action: "/services/" + this._serviceName + "/service_definition",
			callbacks: {
				200: function(response) {
					serviceServiceDefinitionContent._refresh( response );
				}
			}
		});

	},

};

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
								this.$components = [ this._processes() ];
							},

							_processes: function () {
								return {
									class: "well",
									style: "font-family: monospace; box-shadow: none; background-image: none; overflow-x: scroll;",
									$components: [
										{
											$type: "table",
											class: "table",
											$components: [
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

var $serviceDiagnosticsServices = {

	$cell: true,
	id: "serviceDiagnosticsServices",

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
					icon: "fa fa-compass",
					text: "Service diagnostics services",
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
						{
							id: "serviceDiagnosticsServicesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( serviceDiagnosticsServicesContent._data ) ];
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
			action: "/services/" + this._serviceName + "/service_manager/report",
			callbacks: {
				200: function(response) {
					serviceDiagnosticsServicesContent._refresh( response );
				}
			}
		});

	},

};

var $serviceLogs = {

	$cell: true,
	id: "serviceLogs",

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
					text: "Service diagnostics logs",
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
							onclick: function () { serviceLogs._live( serviceName ); }
						} ),
						{
							id: "serviceLogsContent",
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
										{ label: "Output", body: { $components: [
											button( {
												onclick: function() {
													var html = '<pre style=\'font-family: Menlo,Monaco,Consolas,"Courier New",monospace; font-size: 14px; line-height: 1.42857143; color: #333;"\'>' + $("#serviceLogsContentOutput").html() + '</pre>';
													var newWindow = window.open('','Engines' + serviceName + " output log",'width=600, height=600, location=no, toolbar=0, scrollbars=1');
													newWindow.document.title = serviceName + " output log"
													$(newWindow.document.body).html( html );
													newWindow.scrollTo(0,newWindow.document.body.scrollHeight);
												},
												icon: "fa fa-window-maximize",
												text: "Popup",
												wrapperClass: "clearfix",
												class: "pull-right",
												title: "Open build report in new window"
											} ),
											{ id: "serviceLogsContentOutput", $type: "pre", style: "white-space: pre-wrap;", $text: serviceLogsContent._data.stdout }
										] } },
										{ label: "Error", body: { $components: [
											button( {
												onclick: function() {
													var html = '<pre style=\'font-family: Menlo,Monaco,Consolas,"Courier New",monospace; font-size: 14px; line-height: 1.42857143; color: #333;"\'>' + $("#serviceLogsContentError").html() + '</pre>';
													var newWindow = window.open('','Engines' + serviceName + " error log",'width=600, height=600, location=no, toolbar=0, scrollbars=1');
													newWindow.document.title = serviceName + " error log"
													$(newWindow.document.body).html( html );
													newWindow.scrollTo(0,newWindow.document.body.scrollHeight);
												},
												icon: "fa fa-window-maximize",
												text: "Popup",
												wrapperClass: "clearfix",
												class: "pull-right",
												title: "Open build report in new window"
											} ),
											{ id: "serviceLogsContentError", $type: "pre", style: "white-space: pre-wrap;", $text: serviceLogsContent._data.stderr }
										] } }
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
			action: "/services/" + this._serviceName + "/logs",
			callbacks: {
				200: function(response) {
					serviceLogsContent._refresh( response );
				}
			}
		});

	},

};

var $serviceContainer = {

	$cell: true,
	id: "serviceContainer",

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
					icon: "fa fa-cube",
					text: "Service diagnostics container",
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
							onclick: function () { serviceContainer._live( serviceName ); }
						} ),
						{
							id: "serviceContainerContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( serviceContainerContent._data ) ];
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
			action: "/services/" + this._serviceName + "/container",
			callbacks: {
				200: function(response) {
					serviceContainerContent._refresh( response );
				}
			}
		});

	},

};

cell({

	id: "serviceConsumers",

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
					icon: "fa fa-map-signs",
					text: "Service consumers",
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
						dataLoader({
							action: "/services/" + serviceName + "/consumers",
						})

					]
				}
			}
		);

	},

});

cell({

	id: "serviceAbout",

	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},

	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-info-circle",
					text: "Service about"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceMenu._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{
							id: "serviceAboutContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								var version = dig( data, "software", "display", "version" );
								var websiteUrl = dig( data, "software", "display", "url" );
								var licenseUrl = dig(data, "software", "license", "url" );

								this.$components = [
									{
										class: "panel panel-default",
										style: "margin: 15px; box-shadow: 0 2px 5px rgba(0,0,0,.5);",
										$components: [
											{
												class: "panel-heading",
												style: "background-color: #FFF; background-image: none; border-top-left-radius: 3px !important; border-top-right-radius: 3px !important;",
												$components: [
													{
														$type: "h5",
														$text: (
															dig( data, "title" ) ||
															dig( data, "label" )
														) +
														( version ? " (" + version + ")" : "" )
													},
												]
											},
											{
												class: "panel-body",
												$components: [
													markdown( dig( data, "description" ) )
												]
											}
										]
									},
								];
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/services/" + this._serviceName + "/about",
			callbacks: {
				200: function( data ) {
					serviceAboutContent._refresh( data );
				},
			}
		});
	},

});

var $serviceMenu = {

	$cell: true,
	id: "serviceMenu",

	_serviceName: null,
	_serviceData: null,


	_live: function( serviceName ) {

		this._serviceName = serviceName;
		this._serviceData = systemServices._dataFor( serviceName );
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		var serviceData = this._serviceData;
		var state = serviceData.state;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-mobile",
					text: "Service menu"
				} ),
				body: {
					id: "serviceMenuContent",
					$components: [
						{
							class: "clearfix",
							$components: [
								{ $type: "h4",
									class: "pull-left-md",
									$text: serviceName },
								button( {
									icon: "fa fa-cogs",
									text: "Control panel",
									wrapperClass: "pull-right-md",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
							]
						},
						{ $type: "hr" },
						serviceMenu._oomMessage( serviceData.had_oom ),
						{
							style: "min-height: 85.8px;",
							$components: [
								serviceMenu._needsRestartMessage( serviceData.restart_required ),
								serviceMenu._stateDisplay( serviceData ),
								serviceMenu._instructionMessage( state ),
								serviceMenu._stateInstructions( state ),
							]
						},
						{ $type: "hr" },
						serviceMenu._websites(),
						button( {
							icon: "fa fa-info-circle",
							text: "About",
							class: "pull-right-md",
							onclick: function () { serviceAbout._live(serviceName); },
						} )

					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/services/" + this._serviceName + "/websites",
			callbacks: {
				200: function( data ) {
					serviceMenuWebsites._refresh( data );
				},
			}
		});
	},


	_websites: function ( websites ) {

		var serviceName = this._serviceName;

		return {
			id: "serviceMenuWebsites",
			_refresh: function( websites ) {
				this.$components = [
					button( $.extend( {
		 				icon: "fa fa-globe",
		 				text: "Websites",
		 				class: "pull-left-md",
		 				onclick: function () { serviceWebsites._live( serviceName ); },
		 			}, websites.length == 0 ? { disabled: "disabled", title: 'No websites' } : {} ) )
				]
			}
		};
	},



	_oomMessage: function ( hadOom ) {

		return {

			id: "serviceMenuOomMessage",
			_hadOom: null,

			$init: function () {
				this._hadOom = hadOom;
			},

			$update: function () {
				this.$components = [
					this._hadOom ? {
						$components: [
							{
								class: "clearfix",
								$components: [
									{
										class: "pull-left",
										style: "padding-top: 10px;",
										$components: [
											icon( { icon:"fa fa-warning", text: "Ran out of memory", style: "color: red;" } ),
										]
									},
									button( {
										class: "pull-right",
										icon: "fa fa-check",
										text: "OK",
										onclick: serviceMenu._clearOom
									} ),
								]
							},
							{ $type: "hr" },
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._serviceState = state;
			}

		};
	},


	_needsRestartMessage: function( needsRestart ) {

		return {

			id: "serviceMenuNeedsRestartMessage",
			_needsRestart: null,

			$init: function () {
				this._needsRestart = needsRestart;
			},

			$update: function () {
				this.$components = [
					this._needsRestart ? {
						$type: "p",
						$components: [
							icon( {
								icon:"fa fa-warning", text: "Needs restart", style: "color: red;"
							} )
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._needsRestart = state;
			}

		};
	},


	_handleContainerEvent: function( event ) {
		if ( event.container_type == "service" && this._serviceName == event.container_name && typeof serviceMenuContent !== 'undefined' ) {
			serviceMenuStateInstructions._refresh( event.status.state );
			serviceMenuStateDisplay._refresh( event.status );
			serviceMenuNeedsRestartMessage._refresh( event.status.restart_required );
			serviceMenuOomMessage._refresh( event.status.had_oom );
		};
	},


	_instructionMessage: function () {

		return {
			style: "font-size: 12px; display: inline-block;",
			id: "serviceMenuInstructionMessage",
			_showMessage: function ( message ) {
				this.$components = [ {
					$html: " &nbsp; " + message,
					$init: function () {
						setTimeout( function () {
							$( this ).remove();
						}.bind( this ), 2000 );
					}
				} ];
			}
		};

	},


	_stateInstructions: function( state ) {

		return {
			id: "serviceMenuStateInstructions",
			_serviceState: null,
			$init: function () {
				this._serviceState = state;
			},
			$update: function () {
				this.$components = [
					serviceMenu._containerInstructions(this._serviceState),
				];
			},
			_refresh: function( state ) {
				this._serviceState = state;
			}
		};

	},


	_stateDisplay: function( serviceData ) {

		return {
			id: "serviceMenuStateDisplay",
			style: "display: inline-block;",
			_serviceData: null,
			$init: function () {
				this._serviceData = serviceData;
			},
			$update: function () {
				this.$components = [
					{
						$type: "h4",
						style: "margin-left: 17px;",
						title: "Container state is " + this._serviceData.state + ( ( this._serviceData.state == "stopped" && this._serviceData.why_stop ) ? " (" + this._serviceData.why_stop + ")." : "." ),
						$components: [
							containerStateIcon(this._serviceData.state),
							{
								$type: "span",
								$text: this._serviceData.state
							}
						]
					}
				];
			},
			_refresh: function( serviceData ) {
				this._serviceData = serviceData;
			}
		};

	},


	_instruct: function (instruction) {

		serviceMenuInstructionMessage._showMessage("Sending " + instruction + " instruction");
		var serviceName = this._serviceName;
		apiRequest( {
			action: "/services/" + serviceName + "/instruct",
			params: { instruction: instruction },
			callbacks: {
				200: function(e) {
					if ( instruction == "reinstall" ) {
						system._live();
						// Causes build progress to open
					}	else if ( serviceMenu._serviceName == serviceName ) {
						// Check matching service name because a different service menu may have
						// been opened by user during wait for instruction response
						serviceMenuInstructionMessage._showMessage("Sent " + instruction + " instruction");
					};
				}
			},
		} );

	},


	_containerInstructions: function(state) {

		var serviceName = this._serviceName;
		if (state == "running" ) {
			return {
				$components: [
					( serviceName == 'control' && !remoteManagement ) ? {} : button({ onclick: function () { serviceMenu._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { serviceMenu._instruct('restart'); }, icon: "fa fa-play-circle", text: "Restart", wrapperStyle: "display: inline-block"}),
					( serviceName == 'control' && !remoteManagement ) ? {} : button({ onclick: function () { serviceMenu._instruct('pause'); }, icon: "fa fa-pause", text: "Pause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "stopped" ) {
			return {
				$components: [
					button({ onclick: function () { serviceMenu._instruct('start'); }, icon: "fa fa-play", text: "Start", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { serviceMenu._instruct('destroy'); }, icon: "fa fa-bomb", text: "Destroy", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { serviceMenu._instruct('recreate'); }, icon: "fa fa-wrench", text: "Recreate", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "paused" ) {
			return {
				$components: [
					button({ onclick: function () { serviceMenu._instruct('unpause'); }, icon: "fa fa-pause-circle", text: "Unpause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "nocontainer" ) {
			return {
				$components: [
					button({ onclick: function () { serviceMenu._instruct('create'); }, icon: "fa fa-wrench", text: "Create", wrapperStyle: "display: inline-block"}),
				]
			};
		} else {
			return { style: "height: 46px;" };
		};
	},


	_clearOom: function () {
		var serviceName = this._serviceName;
		apiRequest( {
			action: "/services/" + serviceName + "/had_oom",
			method: "DELETE",
			callbacks: {
				200: function(e) {
					system._live( function () {
						serviceMenu._live( serviceName );
					} );
				}
			},
		} );
	}

};

var $serviceDiagnostics = {

	$cell: true,
	id: "serviceDiagnostics",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-stethoscope",
					text: "Service diagnostics"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },

						button( {
							icon: "fa fa-cube",
							text: "Container",
							onclick: function () { serviceContainer._live(serviceName); },
						} ),

						button( {
							icon: "fa fa-file-text-o",
							text: "Logs",
							onclick: function () { serviceLogs._live(serviceName); },
						} ),

						button( {
							icon: "fa fa-list-alt",
							text: "Processes",
							onclick: function () { serviceProcesses._live(serviceName); },
						} ),

						{ $type: "hr" },

						button( {
							icon: "fa fa-compass",
							text: "Services",
							onclick: function () { serviceDiagnosticsServices._live(serviceName); },
						} ),
						button( {
							icon: "fa fa-map-signs",
							text: "Consumers",
							onclick: function () { serviceConsumers._live(serviceName); },
						} ),

						{ $type: "hr" },

						button( {
							icon: false,
							text: "{} Service definition",
							onclick: function () { serviceServiceDefinition._live(serviceName); },
						} ),

					]
				}
			}
		);

	},

};

cell({

	id: "serviceControlPanel",

	_live: function (serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-cogs", text: "Service control panel" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceMenu._live( serviceName ); }
					}),
					hr(),
					dataLoader({
						action: "/services/" + serviceName + "/container",
						render: function(data) {
							return {
								class: "row",
								$components: [
									{
										class: "col-sm-6",
										$components: [
											button( {
												icon: "fa fa-crosshairs",
												text: "Actions",
												onclick: function () {
													if ( systemServices._dataFor(serviceName).state == "running" ) {
														serviceActions._live(serviceName);
													} else {
														alert("Service must be running to perform actions.")
													}
												},
											} ),
											button( {
												icon: "fa fa-cog",
												text: "Configuration",
												onclick: function () { serviceConfigurations._live(serviceName); },
											} ),
											hr(),
											button( {
												icon: "fa fa-microchip",
												text: "Memory",
												onclick: function () { serviceMemory._live(serviceName); },
											} ),
											hr(),
										]
									},
									{
										class: "col-sm-6",
										$components: [
											button( {
												icon: "fa fa-question-circle-o",
												text: "Environment",
												onclick: function () { serviceEnvironmentVariables._live(serviceName); },
											} ),
											button( {
												icon: "fa fa-compass",
												text: "Services",
												onclick: function () { serviceServices._live(serviceName); },
											} ),
											hr(),
											button( {
												icon: "fa fa-stethoscope",
												text: "Diagnostics",
												onclick: function () { serviceDiagnostics._live(serviceName); },
											} ),
											data.persistent ? button( {
												icon: "fa fa-database",
												text: "Data",
												onclick: function () { serviceData._live(serviceName); },
											} ) : {}
										]
									},
								]
							};
						},
					}),
				],
			}
		});

	},

});

cell({

	id: "serviceMemory",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "Service memory" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceMemory._serviceName ); }
								} ),
								{ $type: "h4", $text: serviceMemory._serviceName },
							]
						},
						{ $type: "hr" },
						serviceMemory._memoryUsage(),
						{ $type: "hr" },
						serviceMemory._memoryAllocated(),
					]
				}
			}
		);
		this._load();
	},


	_load: function () {

		apiRequest({
			action: "/services/" + this._serviceName + "/memory",
			callbacks: {
				200: function(response) {
					serviceMemoryAllocated._refresh(response);
				},
			}
		});

	},


	_memoryUsage: function () {

		var serviceName = this._serviceName;

		return {
			id: "serviceMemoryUsage",

			$components: [
				button( {
					icon: "fa fa-pie-chart",
					text: "Usage",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () {
						serviceMemoryUsage.$components = [
							{ $type: "p", $components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							] }
						];
						serviceMemoryUsage._load();
					}
				} )
			],

			_load: function () {

				apiRequest({
					action: '/system/statistics/container_memory',
					callbacks: {
						200: function(response) {
							serviceMemoryUsage._refresh( response );
						},
					}
				});

			},



			_refresh: function( data ) {

				var serviceMemory = data.containers.services[serviceName];

				this.$components = [
					serviceMemory && serviceMemory.current ? dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Current", data: (serviceMemory.current/1024/1024).toFixed(1) + " MB" },
							{ label: "Peak", data: (serviceMemory.maximum/1024/1024).toFixed(1) + " MB" },
						]
					} ) :
					{ $type: "i", $text: "No memory usage."},
				];
			}

		};
	},

	_memoryAllocated: function () {

		var serviceName = this._serviceName;

		return {
			id: "serviceMemoryAllocated",

			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
			],

			_refresh: function( data ) {
				this.$components = [
					dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Allocated", data: data.memory + " MB" },
						]
					} ),
					button({
						wrapperClass: "clearfix",
						class: "pull-right-md",
						icon: "fa fa-edit",
						text: "Edit",
						onclick: function () { serviceMemoryEdit._live( serviceName ); }
					})
				];
			}

		};
	},


});

var $serviceServices = {

	$cell: true,
	id: "serviceServices",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service services",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceServicesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "label", $text: "Persistent" },
									serviceServices._persistentServices(),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									serviceServices._nonpersistentServices(),
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

		apiRequest({
			action: "/services/" + this._serviceName + "/service_manager/services",
			callbacks: {
				200: function(response) {
					serviceServicesContent._refresh( response );
				}
			}
		});

	},


	_persistentServices: function () {
		var owned = serviceServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin != "shared" } );
		var shared = serviceServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin == "shared" } );
		return {
			$components: [
				{ $components: serviceServices._persistentServicesButtons( owned ) },
				shared.length ? {
					$components: [
						{ $type: "small", $text: "Shared" },
						{ $components: serviceServices._persistentServicesButtons( shared ) }
					]
				} : {}
			]
		};
	},

	_persistentServicesButtons: function( services ) {
		return services.length ? services.map( function( service ) {
			return button( {
				text: service.label || service.name,
				onclick: function () {
					serviceServicesPersistent._live(
						serviceServices._serviceName,
						service.publisher_namespace,
						service.type_path,
						service.service_handle );
				}
			} );
		} ) : [ { $type: "i", $text: "None." } ];
	},


	_nonpersistentServices: function () {
		return {
			$components: serviceServicesContent._data[ "non_persistent" ].length ? serviceServicesContent._data[ "non_persistent" ].map( function( nonpersistentService ) {
				return button( {
					text: nonpersistentService.label || nonpersistentService.name,
					onclick: function () {
						serviceServicesNonpersistent._live(
							serviceServices._serviceName,
							nonpersistentService.publisher_namespace,
							nonpersistentService.type_path,
							nonpersistentService.service_handle );
					}
				} );
			} ) : [ { $type: "i", $text: "None." } ]
		};
	},


};

var $serviceActionsResult = {

	$cell: true,
	id: "serviceActionsResult",

	_serviceName: null,
	_actionData: null,
	_responseData: null,

	_live: function ( serviceName, actionData, responseData ) {
		this._serviceName = serviceName;
		this._actionData = actionData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var serviceName = this._serviceName;
		var actionData = this._actionData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service actions",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceActions._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: actionData.label || actionData.name },
						{ $type: "p", $text: actionData.description },
						serviceActionsResult._renderResult( actionData, responseData )
					]
				}
			}
		);

	},

	_renderResult: function ( actionData, responseData ) {
		switch ( actionData.return_type ) {
			case "plain_text":
				return { class: "panel panel-default", $components: [ { class: "panel-body", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) } ] };
				break;
			case "code":
				return { class: "pre", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) };
				break;
			case "json":
				return pp( responseData );
				break;
			case "file":
				return button({
					onclick: function () { downloadTextAsFile( actionData.return_file_name, responseData ) },
					icon: 'fa fa-download',
					text: 'Download'
				});
				break;
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed action." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

};

var $serviceActionsNew = {

	$cell: true,
	id: "serviceActionsNew",

	_live: function (serviceName, actionName) {

		this._serviceName = serviceName;
		this._actionName = actionName;
		this._load();

	},


	_show: function ( data ) {

		var serviceName = this._serviceName;
		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service action",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						hasVariables ?
						serviceActionsNew._form( data ) :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	_postWithoutParams: function ( data ) {

		var serviceName = this._serviceName;

		apiRequest({
			action: "/services/" + serviceName + "/action",
			params: { actionator_name: data.name },
			method: "POST",
			callbacks: {
				200: function( response ) {
					serviceActionsResult._live( serviceName, data, response )
				},
			}
		});
	},

	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/action",
			params: { actionator_name: this._actionName },
			callbacks: {
				200: function(response) {
					serviceActionsNew._show( response );
				}
			}
		});
	},


	_form: function ( data ) {

		var serviceName = this._serviceName;

		return form( {
			components: [
				inDevelopment ? pp(data) : {},
				formField( {
					type: "hidden",
					name: "actionator_name",
					value: data.name
				} ),
				{
					$components: ( data.variables || [] ).map( function ( variable ) {
						variable.name_prefix = "variables";
						return enginesField( variable );
					} )
				},
				formCancel ( {
					onclick: function () {
						serviceActions._live( serviceName );
					}
				} ),
				formSubmit(),
			],
			action: "/services/" + serviceName + "/action",
			method: "POST",
			callbacks: {
				200: function(response) {
					serviceActionsResult._live( serviceName, data, response );
				},
			}
		} )

	}

};

var $serviceMemoryEdit = {

	$cell: true,
	id: "serviceMemoryEdit",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "Service memory" } ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceMemoryEdit._serviceName },
						{ $type: "hr" },
						{
							id: "serviceMemoryEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ serviceMemoryEdit._form( data ) ];
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
			action: "/services/" + this._serviceName + "/memory",
			callbacks: {
				200: function(response) {
					serviceMemoryEditForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "number",
					name: "data[memory]",
					label: "Memory (MB)",
					value: data.memory
				}),
				formCancel ( { onclick: () => { serviceMemory._live( serviceMemoryEdit._serviceName ); } } ),
				formSubmit(),
			],
			action: "/services/" + this._serviceName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					serviceMemory._live( serviceMemoryEdit._serviceName );
				},
			}
		});

	},

};

cell({

  id: "serviceData",

  _live: function(serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-database", text: "Service data" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceControlPanel._live( serviceName ); }
					}),
					hr(),
          button( {
            wrapperClass: "pull-left",
            icon: "fa fa-download",
            text: "Export",
            onclick: function () {
              apiRequest({
          			action: "/services/" + serviceName + "/data/export",
          		});
            },
          } ),
          button( {
            wrapperClass: "pull-right",
            icon: "fa fa-upload",
            text: "Import",
            onclick: function () { serviceImport._live(serviceName); },
          } ),
        ]
      },
    });

  },

});

cell({

  id: "serviceImport",

  _live: function(serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-upload", text: "Service import data" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceControlPanel._live( serviceName ); }
					}),
					hr(),
          form({
            components: [
              formField( {
                name: "data[file]",
                label: "Data file (.gzip)",
                type: "file",
                required: true,
              } ),
              formCancel ( {
                onclick: () => serviceData._live( serviceName )
      				} ),
      				formSubmit(),
      			],
            action: "/services/" + serviceName + "/data/import",
            enctype: "multipart/form-data",
      			method: 'PUT',
      			callbacks: {
      				200: function() {
      					serviceData._live( serviceName );
      				},
      			},
          }),
        ]
      },
    });

  },

});

var $serviceConfigurationsEdit = {

	$cell: true,
	id: "serviceConfigurationsEdit",

	_serviceName: null,
	_configuratorName: null,
	_data: null,


	_live: function (serviceName, configuratorName) {
		this._serviceName = serviceName;
		this._configuratorName = configuratorName;
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/configuration/edit",
			params: { configurator_name: this._configuratorName },
			callbacks: {
				200: function( response ) {
					serviceConfigurationsEdit._show( response )
				},
			}
		});
	},

	_show: function ( data ) {

		var serviceName = this._serviceName;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service configuration",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label },
						{ $type: "p", $text: data.description },
						form( {
							components: [
								formField( {
									type: "hidden",
									name: "configurator_name",
				    			value: data.name
								} ),
								{
									$components: ( Object.values( data.variables ) || [] ).map( function ( variable ) {
										variable.name_prefix = "variables";
										return enginesField( variable );
									} )
								},
								formCancel ( {
									onclick: function () {
										data.no_save ?
										serviceConfigurations._live( serviceName ) :
										serviceConfigurationsShow._live( serviceName, data.name );
									}
								} ),
								formSubmit(),
							],
							action: "/services/" + serviceName + "/configuration",
							method: "PATCH",
							callbacks: {
								200: function(response) {
									if ( data.no_save ) {
										alert("Successfully applied configuration.");
										serviceConfigurations._live( serviceName );
									} else {
										serviceConfigurationsShow._live( serviceName, data.name );
									};
								},
							}
						} ),

					]
				}
			}
		);

	},

};

var $serviceConfigurationsShow = {

	$cell: true,
	id: "serviceConfigurationsShow",

	_serviceName: null,
	_configuratorName: null,
	_data: null,


	_live: function (serviceName, configuratorName) {
		this._serviceName = serviceName;
		this._configuratorName = configuratorName;
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/configuration",
			params: { configurator_name: this._configuratorName },
			callbacks: {
				200: function( response ) {
					serviceConfigurationsShow._show( response )
				},
			}
		});
	},

	_show: function ( data ) {

		var serviceName = this._serviceName;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service configuration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceConfigurations._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: data.label },
						{ $type: "p", $text: data.description },
						dataList({
							class: "dl-horizontal",
							items: data.variables.map( function( variable ) {
								return { label: variable.label, data: variable.value };
							} )
						}),
						button({
							icon: "fa fa-edit",
							class: "pull-right",
							wrapperClass: "clearfix",
							text: "Edit",
							onclick: function () {
								serviceConfigurationsEdit._live( serviceName, data.name )
							}
						}),

					]
				}
			}
		);

	},

};

cell({

	id: "serviceServicesNonpersistentRegistration",

	_live: function( serviceName, publisherNamespace, typePath, serviceHandle, data ) {

		this._serviceName = serviceName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-tag",
					text: "Service non-persistent service registration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceServicesNonpersistent._live( serviceName, publisherNamespace, typePath, serviceHandle ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: serviceServicesNonpersistentRegistration._data.label },
						{ $type: "p", $text: serviceServicesNonpersistentRegistration._data.description },
						{ $type: "hr" },
						button( {
							text: "Register",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "PUT" ) }
						} ),
						button( {
							text: "Deregister",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "DELETE" ) }
						} ),
						button( {
							text: "Reregister",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "PATCH" ) }
						} ),
					]
				}
			}
		);

	},

	_registration: function( method ) {

		var serviceName = this._serviceName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/services/" + serviceName + "/service_manager/nonpersistent/registration/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: method,
			callbacks: {
				200: function() {
					serviceServicesNonpersistent._live( serviceName, publisherNamespace, typePath, serviceHandle );
				}
			},
		});

	},

});

cell({

	id: "serviceServicesNonpersistent",

	_live: function( serviceName, publisherNamespace, typePath, serviceHandle ) {

		this._serviceName = serviceName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service non-persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceServices._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceServicesNonpersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: serviceServicesNonpersistent._load(),

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									button( {
										icon: "fa fa-tag",
										text: "Registration",
										onclick: function () { serviceServicesNonpersistentRegistration._live(
											serviceServicesNonpersistent._serviceName,
											serviceServicesNonpersistent._publisherNamespace,
											serviceServicesNonpersistent._typePath,
											serviceServicesNonpersistent._serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									dataList( { class: "dl-horizontal", items: ( this._data.params.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) ) } ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/services/" + this._serviceName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					serviceServicesNonpersistentContent._refresh( response );
				}
			}
		});

	},

});

cell({

	id: "serviceServicesPersistent",

	_live: function( serviceName, publisherNamespace, typePath, serviceHandle ) {

		this._serviceName = serviceName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceServices._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceServicesPersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: serviceServicesPersistent._load,

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {

								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									dataList( { class: "dl-horizontal", items: this._data.params.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/services/" + this._serviceName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					serviceServicesPersistentContent._refresh( response );
				}
			}
		});

	},

});

var $serviceConfigurations = {

	$cell: true,
	id: "serviceConfigurations",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service configurations",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceConfigurationsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceConfigurationsContent._data.length ?
										serviceConfigurationsContent._data.map(
											function( configuration ) {
												return button( {
													text: ( configuration.label || configuration.name ),
													title: configuration.description || configuration.label || configuration.name,
													onclick: function () {
														configuration.no_save ?
														serviceConfigurationsEdit._live( serviceName, configuration.name ) :
														serviceConfigurationsShow._live( serviceName, configuration.name )
													}
												} );
											}
										) : [
										{ $type: "i", $text: "This service does not have any configurations." }
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

		apiRequest({
			action: "/services/" + this._serviceName + "/configurations",
			callbacks: {
				200: function(response) {
					var configs = Object.values( response );
					serviceConfigurationsContent._refresh( configs );
				}
			}
		});

	},

};

var $serviceEnvironmentVariables = {

	$cell: true,
	id: "serviceEnvironmentVariables",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Service environment variables" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceEnvironmentVariables._serviceName ); }
								} ),
								{ $type: "h4", $text: serviceEnvironmentVariables._serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceEnvironmentVariablesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									dataList({
										class: "dl-horizontal",
										items: data.map( function( variable ) {
											return {
												label: variable.label || variable.name,
												data: variable.value
											};
										})
									}),
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
		apiRequest({
			action: "/services/" + this._serviceName + "/environment_variables",
			callbacks: {
				200: function(response) {
					serviceEnvironmentVariablesContent._refresh(response);
				},
			}
		});
	},

};

var $navbar = {

	$cell: true,
	id: "navbar",
	class: "clearfix",

	_live: function () {
		this.$components = [
			{
				id: 'navbarSystemIp',
				class: "navbar-ip-address",
				style: "font-size: 12px; line-height: 46px; text-align: center; position: absolute; width: 100%; z-index: -1;",
				$text: systemIp,
			},
			{
				class: "navbar-brand pull-left",
				style: "padding: 7px 15px; line-height: 30px;",
				$components: [
					{
						$type: "span",
						style: "margin-top: -3px;",
						$components: [ enginesIconSvg(20) ]
					},
					{
						$type: "span",
						style: "vertical-align: middle;",
						$text: "Engines "
					},
				]
			},
			button({
				onclick: main._signOut,
				wrapperId: "navbarSignOutButton",
				wrapperClass: "pull-right",
				wrapperStyle: "display: none;",
				title: "Sign out",
				icon: "fa fa-sign-out"
			}),
		]
	}
};

var $systemDomains = {

	$cell: true,
	id: "systemDomains",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "System domains" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemControlPanel._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							$components: [
								systemDomains._zeroconf(),
								systemDomains._defaultDomain(),
								systemDomains._domainNames(),
							],
						}
					]
				}
			}
		);
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/system/domains",
			callbacks: {
				200: function( data ) {
					systemDomainsZeroconf._refresh( data.zeroconf );
					systemDomainsDefault._refresh( data.default );
					systemDomainsDomainNames._refresh( data.names );
				},
			}
		});
	},


	_zeroconf: function () {
		return {

			id: "systemDomainsZeroconf",
			_zeroconfEnabled: null,

			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
			],

			_refresh: function( zeroconfEnabled ) {
				this._zeroconfEnabled = zeroconfEnabled
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{
								class: "pull-left",
							 	$components: [
									{ $type: "label", $text: "Avahi (zeroconf)" },
									{ $components: [
										this._zeroconfEnabled ?
											icon( { icon:"fa fa-check", text:"local domain is enabled" } ) :
											icon( { icon:"fa fa-times", text:"local domain is disabled" } ),
									] },
								]
							},
							button( this._zeroconfEnabled ?
						 		{icon: "fa fa-toggle-on", text: "Disable", wrapperClass: "pull-right", onclick: systemDomains._disableZeroconf } :
						 		{icon: "fa fa-toggle-off", text: "Enable", wrapperClass: "pull-right", onclick: systemDomains._enableZeroconf } ),
						]
					},
					{
						$type: "hr",
						style: "border-top: 2px solid #eee;"
					},
				];
			},
		};

	},


	_disableZeroconf: function () {
		if ( systemDomainsDefault._defaultDomain == "local" ) {
			alert("The default domain is local, which is provided by Avahi.\n\nYou will need to change the default domain before you can disable Avahi.")
		} else {
			apiRequest({
				action: "/system/domains/zeroconf",
				method: "delete",
				callbacks: {
					200: function() {
						systemDomainsZeroconf._refresh(false)
					}
				}
			});
		};
	},


	_enableZeroconf: function () {
		apiRequest({
			action: "/system/domains/zeroconf",
			method: "put",
			callbacks: {
				200: function() {
					systemDomainsZeroconf._refresh(true);
				}
			}
		});
	},


	_defaultDomain: function () {
		return {
			id: "systemDomainsDefault",
			_defaultDomain: null,

			_refresh: function( defaultDomain ) {
				this._defaultDomain = defaultDomain
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{
								class: "pull-left",
							 	$components: [
									{	$type: "label", $text: "Default domain"	},
									{ $text: this._defaultDomain },
								]
							},
							button( {icon: "fa fa-edit", text: "Edit", wrapperClass: "pull-right", onclick: systemDomainsDefaultEdit._live } ),
						]
					},
					{
						$type: "hr",
						style: "border-top: 2px solid #eee;"
					},
				];
			},
		};

	},


	_domainNames: function () {
		return {
			id: "systemDomainsDomainNames",

			_domainNamesData: null,

			_refresh: function ( data ) {
				this._domainNamesData = data;
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{	$type: "label", $text: "Domain names", class: "pull-left"	},
							button( {icon: "fa fa-plus", text: "Add", title: "Add a new domain name", wrapperClass: "pull-right", onclick: systemDomainsNew._live } ),
						]
					},
					systemDomains._domainNamesList(this._domainNamesData),
				];

			},

			_remove: function( i ) {
				this._domainNamesData.splice( i ,1 )
			},

		};

	},


	_domainNamesList: function (domains) {
		return {
			$components: domains.map( function( domain, i ) {
				return {
					id: "systemDomainsDomainName_" + domain.domain_name.replace( /\./g, "_" ),
					$components: [
						{ $type: "hr" },
						dataList( { class: "dl-horizontal", items: [
							{ label: "Domain name", data: domain.domain_name },
							{ label: "Self-hosted", data: booleanText( domain.self_hosted ) },
							{ label: "Internal only", data: booleanText( domain.internal_only ) },
						] } ),
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-edit",
									text: "Edit",
									wrapperClass: "pull-left",
									onclick: function () {
										systemDomainsEdit._live( domain );
									}
								}  ),
								button( {
									icon: "fa fa-trash-o",
									text: "Delete",
									wrapperClass: "pull-right",
									onclick: function () {
										if( confirm("Are you sure that you want to delete " + domain.domain_name + "?") ) {
											systemDomains._delete( i );
										};
									}
								} ),
							]
						}
					]
				};
			} )
		};
	},

	_delete: function ( i ) {
		var domainName = systemDomainsDomainNames._domainNamesData[i].domain_name;
		if ( systemDomainsDefault._defaultDomain == domainName ) {
			alert("The default domain is " + domainName + ".\n\nYou will need to change the default domain before you can delete this domain name.")
		} else {
			apiRequest({
				action: "/system/domains/names/" + domainName,
				method: "delete",
				callbacks: {
					200: function() {
						systemDomainsDomainNames._remove( i );
					}
				}
			});
		};
	},

};

cell({

	id: "systemReservedNames",

	_live: function () {
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-ban",
					text: "System reserved names",
				} ),
				body: {
					$components: [
						modalNav({
							up: systemDiagnostics._live
						}),
						hr(),
						dataLoader({
							action: "/system/reserved_names",
						}),

					]
				}
			}
		);

	},

});

var $systemUpdateBaseOS = {

	$cell: true,
	id: "systemUpdateBaseOS",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-refresh", text: "System update Base OS" } ),
				body: {
					$components: [
						icon( { icon: "fa fa-spinner fa-spin", text: "Checking for updates." } )
					]
				}
			}
		);
		this._startUpdate();
	},


	_startUpdate: function () {
		apiRequest({
			action: "/system/update_base_os",
			callbacks: {
				200: function() {
					main._renderBusySystem( { behavior: "base_os_update" } );
				},
				405: function() {
					systemUpdateBaseOS._alreadyUpToDate();
				}
			}
		});
	},


	_alreadyUpToDate: function () {

		modal._live(
			{
				header: icon({icon: "fa fa-refresh", text: "Update Base OS"}),
				body: {
					class: "clearfix",
					$components: [
						{ $text: "Base OS is already up-to-date." },
						button( {
							onclick: systemMenu._live,
							icon: "fa fa-check",
							text: "OK",
							wrapperClass: "pull-right"
						} )
					]
				}
			}
		);
	},

};

cell({

	id: "systemBusy",

	_live: function ( opts={} ) {

		var message;
		switch(opts.behavior) {
    case "engines_update":
			message = "Engines update in progress.\n\nThis normally takes a minute or two, but can take longer in some cases.\n\nPlease wait.";
      break;
		case "engines_restart":
      message = "Engines is restarting.";
      break;
		case "base_os_update":
			message = "Base OS update in progress.\n\nThis normally takes a minute or two, but can take longer in some cases.\n\nPlease wait.";
		  break;
		case "base_os_restart":
			message = "Base OS is restarting.\n\nThis normally takes a few minutes.\n\nPlease wait.";
		  break;
		}

		modal._live(
			{
				header: {
					$type: "span",
					$components: [
						hourglass(),
						{ $type: "span", $text: " System busy" }
					]
				},
				body: {
					$components: [
						{
							id: "systemBusyMessage",
							$type: "p",
							style: "white-space: pre-wrap;",
							$text: message
						}
					]
				}
			}
		);
		this._pollServer();
	},

	_pollServer: function () {
		$("#pageLoadingSpinner").fadeIn();
		setTimeout( function() {
			if (typeof systemBusyMessage !== 'undefined') {
				setTimeout( function() {
					apiRequest({
						action: "/system",
						callbacks: {
							0: function() { systemBusy._pollServer(); },
							502: function() { systemBusy._pollServer(); },
							503: function() { systemBusy._pollServer(); },
							200: function(response) {
								modal._kill();
								alert("System ready.");
								location.reload();
							}
						}
					});
				}, 1000 );
			} else {
				main._renderDisconnectedSystem();
			};
		}, 9000 );
	},

});

cell({

	id: "systemPassword",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-lock", text: "System password" } ),
				body: {
					$components: [
						systemPassword._form()
					]
				}
			}
		);
	},

	_form: function () {
		return form ( {
			components: [
				formField( {
					type: "password",
					name: "data[current_password]",
					label: "Current password",
					required: true,
				} ),
				formField( {
					type: "password_with_confirmation",
					name: "data[new_password]",
					label: "New password",
					required: true,
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/user/admin",
			method: 'PATCH',
			callbacks: {
				200: function(response) {
					alert(
						"You will be redirected to the system sign in page.\n\n" +
						"Please sign in using the new password."
					);
					location.reload();
				},
			}
		});

	},

});

var $systemCertificatesInstall = {

	$cell: true,
	id: "systemCertificatesInstall",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-upload", text: "Install certificate" } ),
				body: {
					$components: [
						{

							id: "systemCertificatesInstallContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							$update: function () {
								this.$components = [ systemCertificatesInstall._form( this._data ) ];
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
			action: "/system/service_certificates",
			callbacks: {
				200: function( data ) {
					systemCertificatesInstallContent._render( data );
				},
			}
		});
	},


	_form: function( data ) {

		return form( {
			components: [
				formField( {
					name: "data[for]",
					id: "systemCertificatesInstallFormInput_target",
					label: "Assign to",
					type: "radio_buttons",
					collection: { default: "System default", unassigned: "Unassigned", service: "Service" },
					value: "default",
				} ),

				formField( {
					name: "data[target]",
					label: false,
					type: "select",
					required: true,
					collection: [ "" ].concat( data.map( function( service_certificate ) { return service_certificate.service_name; } ).filter( function( service_name ) { return service_name != "system"; } ) ),
					value: "default",
					dependOn: {
						input: "systemCertificatesInstallFormInput_target_service",
						property: "checked"
					}
				} ),

				formField( {
					name: "format",
					id: "systemCertificatesInstallFormInput_format",
					label: "Format",
					type: "radio_buttons",
					collection: { "pem": "PEM", "pkcs": "PFX or PKCS#12" },
					value: "pem",
				} ),

				formField( {
					name: "data[certificate_file]",
					type: "file",
					label: "Certificate file (.pem, .crt, .cer)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[key_file]",
					type: "file",
					label: "Key file (.rsa, .key)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[password]",
					type: "password",
					label: "Password",
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[certificate_file]",
					type: "file",
					label: "Certificate file (.pfx, .p12)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pkcs",
						property: "checked"
					}
				} ),

				formCancel ( { onclick: systemCertificates._live } ),
				formSubmit(),
			],
			action: "/system/certificates",
			callbacks: {
				200: function(response) {
					systemCertificates._live();
				},
			},
		} );
	},

};

var $systemRestartBaseOS = {

	$cell: true,
	id: "systemRestartBaseOS",

	_live: function() {
		var baseOSName = system._$data.properties.version.base_os.name;
		modal._live(
			{
				header: icon( { icon: "fa fa-power-off", text: "System restart " + baseOSName } ),
				body: {
					$components: [
						{ $type: "p", $text: "Restart " + baseOSName + "? This will reboot the system." },
						systemRestartBaseOS._form(),
					]
				}
			}
		);
	},


	_form: function () {

		return form ( {
			components: [
				formCancel ( { onclick: systemMenu._live } ),
				formSubmit(),
			],
			action: "/system/restart_base_os",
			method: 'GET',
			callbacks: {
				200: function(response) {
					setTimeout( function () {
						main._renderBusySystem( { behavior: "base_os_restart" } );
					}.bind( this ), 1000 );

				},
			}
		});

	},


};

var $systemRegion = {

	$cell: true,
	id: "systemRegion",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-map-marker", text: "System region" } ),
				body: {
					$components: [
            {
							class: "clearfix",
							$components: [
								button( {
									onclick: systemControlPanel._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							id: "systemRegionLocaleContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [
                  systemRegion._locale(localeData),
                  button({
                    icon: "fa fa-edit",
                    text: "Edit",
                    wrapperClass: "clearfix",
                    class: "pull-right-md",
                    onclick: systemRegionLocale._live
                  })
                ];
							},
						},
            { $type: "hr" },
            {
							id: "systemRegionTimezoneContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [
                  systemRegion._timezone(localeData),
                  button({
                    icon: "fa fa-edit",
                    text: "Edit",
                    wrapperClass: "clearfix",
                    class: "pull-right-md",
                    onclick: systemRegionTimezone._live
                  })
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

    apiRequest({
      action: "/system/timezone",
      callbacks: {
        200: function(response) {
          systemRegionTimezoneContent._refresh(response);
        },
      }
    });

		apiRequest({
			action: "/system/locale",
			callbacks: {
				200: function(response) {
					systemRegionLocaleContent._refresh(response);
				},
			}
		});

	},


  _locale: function( data ) {
		return dataList ( {
      class: "dl-horizontal",
			items: [
        { label: "Country", data: data.country_code },
        { label: "Language", data: data.lang_code },
			]
    } );
  },

  _timezone: function( data ) {
		return dataList ( {
      class: "dl-horizontal",
			items: [
        { label: "Timezone", data: data.timezone },
			]
    } );
	},

};

var $systemDefaultSite = {

	$cell: true,
	id: "systemDefaultSite",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-home", text: "System default site" } ),
				body: {
					$components: [
						{
							id: "systemDefaultSiteForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemDefaultSite._form( data ) ];
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
			action: "/system/default_site",
			callbacks: {
				200: function(response) {
					systemDefaultSiteForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					name: "data[default_site]",
					label: "Default site",
					hint: "Enter a host name (e.g: www.engines.org )",
					value: data.default_site
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/default_site",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});

	},

};

// var $systemAdminUserEmail = {
//
// 	$cell: true,
// 	id: "systemAdminUserEmail",
//
//
// 	_live: function() {
// 		modal._live(
// 			{
// 				header: icon( { icon: "fa fa-lock", text: "Admin user password" } ),
// 				body: {
// 					$components: [
// 						{
// 							id: "systemAdminUserEmailForm",
// 							$components: [
// 								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
// 							],
// 							_refresh: function ( data ) {
// 								this.$components = [ systemAdminUserEmail._form( data ) ];
// 							},
// 						}
// 					]
// 				}
// 			}
// 		);
// 		this._load();
// 	},
//
// 	_load: function () {
// 		apiRequest({
// 			action: "/system/user/admin",
// 			callbacks: {
// 				200: function(response) {
// 					systemAdminUserEmailForm._refresh(response);
// 				},
// 			}
// 		});
// 	},
//
//
// 	_form: function ( data ) {
// 		return form ( {
// 			components: [
// 				formField( {
// 					type: "site_password",
// 					name: "data[current_password]",
// 					// id: "systemPasswordField_current_password",
// 					label: "Current password",
// 				} ),
// 				formField( {
// 					type: "hidden",
// 					name: "data[username]",
// 					value: "admin",
// 				} ),
// 				formField( {
// 					type: "email",
// 					name: "data[email]",
// //					id: "systemAdminUserEmailField_default_site",
// 					label: "Admin email",
// 					value: data.email
// 				} ),
// 				formCancel ( { onclick: "systemAdminUser._live();" } ),
// 				formSubmit(),
// //				pp( data )
// 			],
// 			action: "/system/user/admin",
// 			method: 'PATCH',
// 			callbacks: {
// 				200: function(response) {
// 					systemAdminUser._live();
// 				},
// 			}
// 		});
//
// 	},
//
// };

var $systemShutdown = {

	$cell: true,
	id: "systemShutdown",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-plug", text: "System shutdown" } ),
				body: {
					$components: [
						{
							id: "systemShutdownForm",
							$components: [
								{
									type: "p",
									style: "color: red;",
								 	$components: [
										icon( {
											icon: "fa fa-warning",
											text: "The system will shutdown. You will need to manually restart." } )
									]
								},
								systemShutdown._form()
							],
						}
					]
				}
			}
		);
	},


	_form: function () {
		return form ( {
			components: [
				formField( {
					type: "text",
					name: "data[reason]",
					id: "systemShutdownField_shutdown",
					label: "Reason",
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/shutdown",
			callbacks: {
				200: function(response) {
					main._renderDisconnectedSystem();
				},
			}
		});

	},

};

var $systemCertificates = {

	$cell: true,
	id: "systemCertificates",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-certificate", text: "System certificates" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemControlPanel._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							class: "clearfix",
							$components: [
								button( { icon: "fa fa-shield", text: "Service certificates", wrapperClass: "pull-left-md", onclick: systemServiceCertificates._live } ),
								button( { icon: "fa fa-check-square-o", text: "CA", title: "Certificate authority", wrapperClass: "pull-right-md", onclick: systemCertificates._downloadCa } ),
							]
						},
						{ $type: "hr", style: "border-top: 2px solid #eee;" },
						{
							class: "clearfix",
							$components: [
								{ $type: "label", $text: "Installed certificates" },
								button( { icon: "fa fa-plus", text: "Add", title: "Install a new certificate", wrapperClass: "pull-right-md", onclick: systemCertificatesInstall._live } ),
							]
						},
						{

							id: "systemCertificatesContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							_remove: function( i ) {
								this._data.splice( i ,1 )
							},

							$update: function () {
								this.$components = systemCertificates._certificates( this._data );
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
			action: "/system/certificates",
			callbacks: {
				200: function( data ) {
					systemCertificatesContent._render( data );
				},
			}
		});
	},


	_downloadCa: function () {
		apiRequest({
			action: "/system/certificate_authority",
		});
	},


	_certificates: function( data ) {
		return data.map( function( certificate, i ) {
			var certificatePath = certificate.store + "/" + certificate.cert_name;
			return {
				$components: [
					{ $type: "hr" },
					dataList( { class: "dl-horizontal", items: [ { label: "Store" , data: certificate.store }, { label: "Name", data: certificate.cert_name }, ] } ),
					{
						class: "clearfix",
						$components: [
							button( {
								icon: "fa fa-download",
								text: "Download",
								class: "pull-left-md",
								onclick: () => {
									systemCertificates._downloadCertificate( certificatePath )
								}
							} ),
							button( {
								icon: "fa fa-trash",
								text: "Delete",
								class: "pull-right-md",
								onclick: function () {
									if ( confirm("Are you sure that you want to delete certificate " + certificatePath + "?") ) {
										systemCertificates._deleteCertificate( certificatePath, i )
									};
								},
							} ),
						]
					}
				]
			};
		} )
	},


	_downloadCertificate: function( certificatePath  ) {
		apiRequest({
			action: "/system/certificates/",
			params: { certificate_path: certificatePath }
		});
	},


	_deleteCertificate: function( certificatePath , i ) {
		apiRequest({
			action: "/system/certificates/",
			params: { certificate_path: certificatePath },
			method: "DELETE",
			callbacks: {
				200: function () { systemCertificatesContent._remove( i ) }
			}
		});
	},


};

cell({

	id: "systemDisconnected",

  _live: function () {
    this.$components = [
      {
        class: "text-center",
        style: "display: none;",
        $init: function() { $(this).fadeIn(); },
        $components: [
          { $text: "System not connected." },
          button({
            icon: "fa fa-repeat",
            onclick: "location.reload();"
          })
        ]
      }
    ];
  },

  _kill: function () {
    this.$components = [];
  },

});

var $systemOrphanData = {

	$cell: true,
	id: "systemOrphanData",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-compass", text: "System orphan data" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemDiagnostics._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							id: "systemOrphanDataContent",
							_data: null,
							_refresh: function ( data ) {
								this._data = data;
							},
							_removeGroupItem: function( groupIndex, itemIndex ) {

								$(this).find(".systemOrphanDataApp").eq( groupIndex )[0]._remove( itemIndex );
							},
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							$update: function () {
								this.$components = [ systemOrphanData._orphans( this._data ) ];
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
			action: "/system/orphan_data",
			callbacks: {
				200: function( data ) {
					systemOrphanDataContent._refresh(data);
				},
			}
		});
	},


	_orphans: function( data ) {
		var groupedData = groupArrayBy( data, "parent" );
		var appNames = Object.keys( groupedData );
		return {
			$components: appNames.map( function( key, groupIndex ) {
   			return systemOrphanData._orphanApp ( key, groupedData[key], groupIndex );
			} ).concat( appNames.length == 0 ? { $type: "i", $text: "None" } : {} )
		};
	},


	_orphanApp: function ( appName, data, groupIndex ) {
		return collapse( {
			wrapperClass: "systemOrphanDataAppWrapper",
			text: appName,
			body: {
				class: "systemOrphanDataApp",
				_data: data,
				_remove: function( i ) {
					if ( this._data.length == 1 ) {
						$(this).parents(".systemOrphanDataAppWrapper").hide();
					} else {
						this._data.splice( i ,1 );
					};
				},
				$init: function () { this.$update() },
				$update: function () {
					this.$components = data.map( function( orphan, i ) {
		 				return systemOrphanData._orphan( orphan, groupIndex, i, data.length );
		 			} )
				},
			}
		} );
	},


	_orphan: function( data, groupIndex, itemIndex, orphanCount ) {
		var orphanId = ( data.publisher_namespace + "|" + data.type_path.replace(/\//g, "|") + "|" + data.parent + "|" + data.service_handle );
		var title = data.type + ( data.parent == data.service_handle ? "" : " (" + data.service_handle + ")" );
		return {
			class: "systemOrphanDataAppItem",
			$components: [
				{ $text: title },
				{
					class: "clearfix",
					$components: [
						button( {
							icon: "fa fa-download",
							text: "Download",
							wrapperClass: "pull-left-md",
							onclick: function () {
								systemOrphanData._download( orphanId );
							}
						}  ),
						button( {
							icon: "fa fa-trash-o",
							text: "Delete",
							wrapperClass: "pull-right-md",
							onclick: function () {
								if( confirm("Are you sure that you want to delete the " + title + " for " + data.parent + "?") ) {
									systemOrphanData._delete( orphanId, groupIndex, itemIndex );
								};
							}
						} ),
					]
				},
				( itemIndex + 1 == orphanCount ? {} : { $type: "hr" } ),
			]
		};
	},

	_delete: function( orphanId, groupIndex, itemIndex ) {
		apiRequest( {
			action: "/system/orphan_data/" + orphanId,
			method: "delete",
			callbacks: {
				200: function () {
					systemOrphanDataContent._removeGroupItem( groupIndex, itemIndex );
				}
			}
		} );
	},

};

var $systemRegistry = {

	$cell: true,
	id: "systemRegistry",


	_live: function() {
		modal._live(
			{
				dialogClass: "modal-lg",
				header: icon( { icon: "fa fa-arrows", text: "System registry" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemDiagnostics._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
								button( { onclick: systemRegistry._live,
									icon: "fa fa-repeat", text: "Refresh" }
								),
							]
						},
						{
							id: "systemRegistryTree",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (registryData) {
								this.$components = [ tree(registryData) ];
							},
						}
					]
				}
			}
		);
		this._loadRegistry();
	},

	_loadRegistry: function () {
		apiRequest({
			action: "/system/registry",
			callbacks: {
				200: function(response) {
					systemRegistryTree._refresh(response);
				},
			}
		});
	},

};

var $systemMenu = {

	$cell: true,
	id: "systemMenu",


	_live: function () {

		authCheck(); // this modal does not call api for data, so do fake call to check if auth'd

		var baseOsName = system._$data.properties.version.base_os.name;
		modal._live ( {
			header: icon( { icon: "fa fa-hdd-o", text: "System menu" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( { onclick: installFromLibrary._live,
												class: "pull-left-md",
												icon: "fa fa-plus", text: "Install app"	} ),
							button( { onclick: systemControlPanel._live,
												class: "pull-right-md",
												icon: "fa fa-gears", text: "Control panel" } ),
						]
					},
					{ $type: "hr" },
					system._$data.status.needs_engines_update == true ? {
						$type: "p",
						$components: [
							icon( {icon: "fa fa-warning", text: "Needs update", style: "color: red;" } )
						],
					} : {},
					{
						class: "clearfix",
						$components: [
							dataList( {
								class: "pull-left-md",
								items: [
									{
										label: "Engines",
										data: system._$data.properties.version.engines
									},
								]
							} ),
							button( {
								class: "pull-right-md",
								onclick: systemUpdateEngines._live,
								icon: "fa fa-refresh",
								text: "Update",
								title: "Update Engines"
							} ),
							button( { onclick: systemRestartEngines._live, class: "pull-right-md",
												icon: "fa fa-play-circle", text: "Restart", title: "Restart Engines" } ),
						]
					},
					{ $type: "hr" },
					system._$data.status.needs_reboot == true ? {
						$type: "p",
						$components: [
							icon( { icon: "fa fa-warning", text: "Needs reboot", style: "color: red;" } )
						],
					} : {},
					system._$data.status.needs_base_update == true ? {
						$type: "p",
						$components: [
							icon( { icon: "fa fa-warning", text: "Needs update", style: "color: red;" } )
						],
					} : {},
					{
						class: "clearfix",
						$components: [
							dataList( {
								class: "pull-left-md",
								items: [
									{
										label: system._$data.properties.version.base_os.name,
										data:  system._$data.properties.version.base_os.version
									},
								]
							} ),
							button( {
								class: "pull-right-md",
								onclick: systemUpdateBaseOS._live,
								icon: "fa fa-refresh",
								text: "Update",
								title: "Update " + baseOsName
							} ),
							button( { onclick: systemRestartBaseOS._live, class: "pull-right-md",
												icon: "fa fa-power-off", text: "Reboot", title: "Restart " + baseOsName + " (reboot system)" } ),
						]
					},
					{ $type: "hr" },
					{
						id: "systemMenuDisplayOptions",

						$components: [
							button({
								icon: "fa fa-dashboard",
								text: "Display",
								onclick: function () { systemMenuDisplayOptions._showOptions(); },
							})
						],

						_showOptions: function () {
							this.$components = [
								system._$showContainerMemoryUsage ?
								button({
									id: "hideContainerMemoryUsageButton",
									icon: "fa fa-microchip",
									text: "Hide memory usage",
									title: "Hide container memory usage",
									onclick: systemMenu._hideContainerMemoryUsage
								}) :
								button({
									id: "showContainerMemoryUsageButton",
									icon: "fa fa-microchip",
									text: "Show memory usage",
									title: "Show container memory usage",
									onclick: systemMenu._showContainerMemoryUsage,
								}),
								system._$showServices ?
								button({
									icon: "fa fa-compass",
									id: "hideServicesButton",
									text: "Hide services",
									title: "Hide services",
									onclick: systemMenu._hideServices,
								}) :
								button({
									icon: "fa fa-compass",
									id: "showServicesButton",
									text: "Show services",
									title: "Show services",
									onclick: systemMenu._showServices,
								}),
								system._$showSoftwareTitles ?
								button({
									id: "hideSoftwareTitlesButton",
									icon: "fa fa-info",
									text: "Hide software titles",
									title: "Hide software titles",
									onclick: systemMenu._hideSoftwareTitles
								}) :
								button({
									id: "showSoftwareTitlesButton",
									icon: "fa fa-info",
									text: "Show software titles",
									title: "Show software titles",
									onclick: systemMenu._showSoftwareTitles,
								}),
							]
						},
					},

				]
			}
		} );

	},

	_showSoftwareTitles: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_software_titles: true },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					system._$showSoftwareTitles = true;
					system._live();
				},
			}
		});
	},

	_hideSoftwareTitles: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_software_titles: false },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					system._$showSoftwareTitles = false;
					system._live();
				},
			}
		});
	},

	_showContainerMemoryUsage: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_container_memory_usage: true },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					system._$showContainerMemoryUsage = true;
					system._live();
				},
			}
		});
	},

	_hideContainerMemoryUsage: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_container_memory_usage: false },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					system._$showContainerMemoryUsage = false;
					system._live();
				},
			}
		});
	},

	_showServices: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_services: true },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					system._$showServices = true;
					system._live();
				},
			}
		});
	},

	_hideServices: function () {
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_services: false },
			callbacks: {
				200: function(response) {
					$("#pageLoadingSpinner").fadeIn();
					$(".modal").modal("hide");
					$('#services').slideUp('fast');
					system._$showServices = false;
					system._live();
				},
			}
		});
	},


};

var $systemDomainsEdit = {

	$cell: true,
	id: "systemDomainsEdit",


	_live: function ( data ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "Edit domain name" } ),
				body: {
					$components: [
						systemDomainsNamesForm._form( data )
					]
				}
			}
		);
	},

};

var $systemDomainsNamesForm = {

	$cell: true,
	id: "systemDomainsNamesForm",

	_form: function( data ) {

    var isEditForm = data ? true : false;
    var method = isEditForm ? "PUT" : "POST";
    var action = isEditForm ? "/system/domains/names/" + data.domain_name : "/system/domains/names";
    data = isEditForm ? data : {};

		return form( {
			components: [
				formField( {
					name: "data[domain_name]",
					id: "systemDomainsNamesFormField_domain_name",
					required: true,
					label: "Domain name",
          disabled: isEditForm,
    			value: data.domain_name
				} ),
				formField( {
					type: "checkbox",
					name: "data[self_hosted]",
					id: "systemDomainsNamesFormField_self_hosted",
					label: "Self-hosted",
    			value: data.self_hosted,
				} ),
				formField( {
					type: "checkbox",
					name: "data[internal_only]",
					id: "systemDomainsNamesFormField_internal_only",
					label: "Internal only",
    			value: data.internal_only,
					dependOn: {
						input: "systemDomainsNamesFormField_self_hosted",
						property: "checked"
					}
				} ),
				formCancel ( {
					onclick: function () {
						systemDomains._live();
					}
				} ),
				formSubmit(),
			],
			action: action,
			method: method,
			callbacks: {
				200: function(response) {
					systemDomains._live();
				},
			}
		} );

	},

};

var $systemDomainsDefaultEdit = {

	$cell: true,
	id: "systemDomainsDefaultEdit",


	_live: function( defaultDomain ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-star-o", text: "Default domain" } ),
				body: {
					$components: [
						{
							id: "systemDomainsDefaultEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function( data ) {
								this.$components = [ systemDomainsDefaultEdit._form( data ) ];
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
			action: "/system/domains",
			callbacks: {
				200: function(response) {
					systemDomainsDefaultEditForm._refresh(response);
				},
			}
		});
	},


	_form: function (data) {

		var namesCollection = data.names.map( function( domain ) { return domain.domain_name } );
		if ( data.zeroconf ) {
			namesCollection.push( "local" );
		};

		return form ( {
			components: [
				formField( {
					type: "select",
					name: "data[default_domain]",
					id: "systemDomainsDefaultEditField_default_domain",
					label: "Default domain",
					value: data.default,
					collection: namesCollection,
				} ),
				formCancel ( { onclick: systemDomains._live } ),
				formSubmit(),
			],
			action: "/system/domains/default",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemDomains._live();
				},
			}
		});

	},

};

var $systemDomainsNew = {

	$cell: true,
	id: "systemDomainsNew",


	_live: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "New domain name" } ),
				body: {
					$components: [
						systemDomainsNamesForm._form()
					]
				}
			}
		);
	},


};

var $systemSshKeysUploadPublic = {

	$cell: true,
	id: "systemSshKeysUploadPublic",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-caret-square-o-right", text: "Side load" } ),
				body: {
					$components: [
						form( {
							components: [
								formField( {
									name: "data[key_file]",
											id: "systemSshKeysUploadPublicField_key",
											type: "file",
											label: "Public key file",
											required: true
								} ),
								formCancel ( { onclick: systemSshKeys._live } ),
								formSubmit(),
							],
							enctype: "multipart/form-data",
							action: "/system/ssh_keys/public",
							method: "PUT",
							callbacks: {
								200: function(response) {
									systemSshKeys._live();
								},
							}
						} )
					]
				}
			}
		);
	},

};

cell({

	id: "systemDiagnostics",

	_live: function () {

		authCheck(); // this modal does not call api for data, so do fake call to check if auth'd

		modal._live ( {
			header: icon( { icon: "fa fa-stethoscope", text: "System diagnostics" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemControlPanel._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					{
						class: "row",
						$components: [
							{
								class: "col-sm-6",
								$components: [
									button( { onclick: systemRegistry._live,
														icon: "fa fa-arrows", text: "Registry" } ),
									button( { onclick: systemStatistics._live,
														icon: "fa fa-bar-chart", text: "Statistics" } ),
									button( { onclick: systemReservedNames._live,
														icon: "fa fa-ban", text: "Reserved names" } ),
								]
							},
							{
								class: "col-sm-6",
								$components: [
									button( { onclick: systemLastInstall._live,
														icon: "fa fa-history", text: "Last install" } ),
									button( { onclick: systemOrphanData._live,
														icon: "fa fa-compass", text: "Orphan data" } ),
									button( { onclick: systemExceptionReporting._live,
														icon: "fa fa-bug", text: "Bug reports" } ),
								]
							}
						]
					}
				]
			}
		} );

	}

});

// var $systemAdminUser = {
//
// 	$cell: true,
// 	id: "systemAdminUser",
//
//
// 	_live: function() {
// 		modal._live(
// 			{
// 				header: icon( { icon: "fa fa-user", text: "System admin user" } ),
// 				body: {
// 					$components: [
// 						{
// 							class: "clearfix",
// 							$components: [
// 								button( {
// 									onclick: "systemControlPanel._live()",
// 									icon: "fa fa-arrow-up",
// 									wrapperClass: "pull-right"
// 								} ),
// 							]
// 						},
// 						{
// 							id: "systemAdminUserContent",
// 							$components: [
// 								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
// 							],
// 							_refresh: function ( data ) {
// 								this.$components = [ systemAdminUser._content( data ) ];
// 							},
// 						}
// 					]
// 				}
// 			}
// 		);
// 		this._load();
// 	},
//
// 	_load: function () {
// 		apiRequest({
// 			action: "/system/user/admin",
// 			callbacks: {
// 				200: function(response) {
// 					systemAdminUserContent._refresh(response);
// 				},
// 			}
// 		});
// 	},
//
//
// 	_content: function ( data ) {
// 		return {
// 			$components: [
// 				{
// 					$type: "label",
// 					$text: "email"
// 				},
// 				{
// 					$text: data.email
// 				},
// 				{ $type: "hr" },
// 				button( {
// 					icon: "fa fa-lock",
// 					text: "Password",
// 					onclick: systemPassword._live
// 				} ),
// 				button( {
// 					icon: "fa fa-envelope",
// 					text: "Email",
// 					onclick: systemAdminUserEmail._live
// 				} ),
// 			]
// 		};
//
// 	},
//
// };

var $systemRestartEngines = {

	$cell: true,
	id: "systemRestartEngines",

	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-play-circle", text: "System restart Engines" } ),
				body: {
					$components: [
						{ $type: "p", $text: "Restart Engines?" },
						systemRestartEngines._form(),
					]
				}
			}
		);
	},

	_form: function () {

		return form ( {
			components: [
				formCancel ( { onclick: systemMenu._live } ),
				formSubmit(),
			],
			action: "/system/restart_engines",
			method: 'GET',
			callbacks: {
				200: function(response) {
					main._renderBusySystem( { behavior: "engines_restart" } );
				},
			}
		});

	},

};

cell({

	id: "systemControlPanel",

	_live: function () {

		authCheck(); // this modal does not call api for data, so do fake call to check if auth'd

		modal._live ( {
			header: icon( { icon: "fa fa-cogs", text: "System control panel" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemMenu._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					{
						class: "row",
						$components: [
							{
								class: "col-sm-6",
								$components: [
									button( { onclick: systemPassword._live,
														icon: "fa fa-lock", text: "System password" } ),
									button( { onclick: systemRegion._live,
														icon: "fa fa-map-marker", text: "Region"	} ),
									button( { onclick: systemDefaultSite._live,
														icon: "fa fa-home", text: "Default site" } ),
									{ $type: "hr" },
									button( { onclick: systemCertificates._live,
														icon: "fa fa-certificate", text: "Certificates" } ),
									button( { onclick: systemDomains._live,
														icon: "fa fa-globe", text: "Domains" } ),
									button( { onclick: systemSshKeys._live,
														icon: "fa fa-key", text: "SSH keys" } ),
									{ $type: "hr" },
								]
							},
							{
								class: "col-sm-6",
								$components: [
									button( { onclick: systemUsers._live,
														icon: "fa fa-user", text: "Users" } ),
									button( { onclick: systemEmail._live,
														icon: "fa fa-envelope", text: "Email" } ),
									{ $type: "hr" },
									button( { onclick: installSideLoad._live,
														icon: "fa fa-caret-square-o-right", text: "Side load" } ),
									button( { onclick: systemDiagnostics._live,
														icon: "fa fa-stethoscope", text: "Diagnostics" } ),
									{ $type: "hr" },
									button( { onclick: systemShutdown._live,
														icon: "fa fa-plug", text: "Shutdown" } ),
								]
							}
						]
					}
				]
			}
		} );

	}

});

var $systemExceptionReporting = {

	$cell: true,
	id: "systemExceptionReporting",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-bug", text: "Bug reports" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemDiagnostics._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							class: "clearfix",
							$components: [
								{
									class: "pull-left",
									$components: [
										{ $type: "label", $text: "Bug reports" },
										{ $components: [
											system._$data.report_exceptions ?
												icon( { icon:"fa fa-check", text:"Send bug reports" } ) :
												icon( { icon:"fa fa-times", text:"Do not send bug reports" } ),
										] },
									]
								},
								button( system._$data.report_exceptions ?
									{ icon: "fa fa-toggle-on", text: "Disable", wrapperClass: "pull-right", onclick: systemExceptionReporting._disable } :
									{ icon: "fa fa-toggle-off", text: "Enable", wrapperClass: "pull-right", onclick: systemExceptionReporting._enable } ),
							]
						}
					],
				}
			}
		);
	},


	_disable: function() {
		apiRequest({
			action: "/system/exception_reporting",
			method: "delete",
			callbacks: {
				200: function() {
					var system_data = system._$data;
					system_data.report_exceptions = false;
					system._$data = system_data;
					systemExceptionReporting._live();
				}
			}
		});
	},

	_enable: function() {
		apiRequest({
			action: "/system/exception_reporting",
			method: "put",
			callbacks: {
				200: function() {
					var system_data = system._$data;
					system_data.report_exceptions = true;
					system._$data = system_data;
					systemExceptionReporting._live();
				}
			}
		});
	},


};

var $systemServiceCertificatesEdit = {

	$cell: true,
	id: "systemServiceCertificatesEdit",


	_live: function ( serviceCertificateData ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-shield", text: "Edit service certificate" } ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceCertificateData.service_name },
						{
							id: "systemServiceCertificatesEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function( systemCertificatesData ) {
								this.$components = [
									systemServiceCertificatesEdit._form(
										serviceCertificateData,
										systemCertificatesData
									)
								];
							},
						}
					]
				},
			}
		);
		this._load();
	},

	_load: function () {
		apiRequest({
			action: "/system/certificates",
			callbacks: {
				200: function( data ) {
					systemServiceCertificatesEditForm._refresh( data );
				},
			}
		});
	},


	_form: function( serviceCertificateData, systemCertificatesData ) {

		return form( {
			components: [
				formField( {
					type: "select",
					name: "data[certificate]",
					label: "Certificate",
					value: serviceCertificateData.cert_name ? serviceCertificateData.store_name + '|' + serviceCertificateData.cert_name : "",
					collection: systemCertificatesData.map( function( availableCertificate ) {
						return [ availableCertificate.store + "|" + availableCertificate.cert_name, availableCertificate.store + "/" + availableCertificate.cert_name ];
					} ),
					collectionIncludeBlank: true,
				} ),
				formCancel ( {
					onclick: function () {
						systemServiceCertificates._live();
					}
				} ),
				formSubmit(),
				{ $type: "br" },
				{ $type: "br" },
				{ $type: "hr" },
				{ $type: "label", $text: "current cert for " + serviceCertificateData.service_name },
				{ $text: serviceCertificateData.store.store_path + serviceCertificateData.service_name },
				{ $type: "br" },
				{ $type: "label", $text: "available system certs" },
				{ $html: systemCertificatesData.map( function( availableCertificate ) {
					return availableCertificate.store + "/" + availableCertificate.cert_name;
				} ).join('<br>') },
				{ $type: "hr" },
				pp( serviceCertificateData ),
				pp( systemCertificatesData ),
			],
			action: "/system/service_certificates/" + serviceCertificateData.service_name,
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemServiceCertificates._live();
				},
			}
		} );
	},

};

cell({

	id: "systemUnavailable",

	_live: function ( opts={} ) {
		modal._live(
			{
				header: icon({icon: "fa fa-window-close", text: "System unavailable"}),
				body: {
					$components: [
						{
							id: "systemUnavailableMessage",
							$init: function () {
								this._updateMessage ( opts.message );
							},
							_updateMessage: function ( message ) {
								this.$components = [ { $type: "p", style: "white-space: pre-wrap;", $text: message || "Failed to connect.\n\nPlease wait." } ];
							},
						},
					]
				}
			}
		);
		this._pollServer();
	},


	_pollServer: function () {
		$("#pageLoadingSpinner").fadeIn();
		setTimeout( function() {
			if (typeof systemUnavailableMessage !== 'undefined') {
				systemUnavailableMessage._updateMessage( "Checking system status..." );
				setTimeout( function() {
					apiRequest({
						action: "/system",
						callbacks: {
							0: function() {
								systemUnavailable._handlePollingResponseFailure();
							},
							200: function(response) {
								modal._kill();
								alert("System ready.");
								location.reload();
							},
							502: function(response) {
								systemUnavailable._handlePollingResponseFailure(response.error.message);
							},
							503: function(response) {
								systemBusy._live(response.error);
							},
						}
					});
				}, 1000 );
			} else {
				main._renderDisconnectedSystem();
			};
		}, 9000 );
	},

	_handlePollingResponseFailure: function( message ) {
		// check if modal still open, if not then don't poll
		if (typeof systemUnavailableMessage !== 'undefined') {
			systemUnavailableMessage._updateMessage( message );
			systemUnavailable._pollServer();
		} else {
			main._renderDisconnectedSystem();
		};
	},


});

var $systemLastInstall = {

	$cell: true,
	id: "systemLastInstall",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-history", text: "System last install" } ),
				dialogClass: "modal-lg",
				body: {
					$components: [
						{
							id: "systemLastInstallContent",
							$components: [
								{
									class: "clearfix",
									$components: [
										button( {
											onclick: systemDiagnostics._live,
											icon: "fa fa-arrow-up",
											wrapperClass: "pull-right"
										} ),
									]
								},
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemLastInstall._content( data ) ];
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
			action: "/system/last_install",
			callbacks: {
				200: function( data ) {
					systemLastInstallContent._refresh( data );
				},
			}
		});
	},


	_content: function ( data ) {
		return {
			$components: [
				{
					class: "clearfix",
					$components: [
						button( {
							onclick: systemDiagnostics._live,
							icon: "fa fa-arrow-up",
							wrapperClass: "pull-right"
						} ),
						{
							$type: "h4",
							class: "pull-left",
							$text: dig( data, "params", "engine_name" )
						},
					]
				},
				tabs( {
					items: [
						{
							label: "Log",
							body: { $type: "pre", $text: data.log }
						},
						{
							label: "Params",
							body: pp( data.params )
						}
					]
				} )
			]
		};

	},

};

var $systemUpdateEngines = {

	$cell: true,
	id: "systemUpdateEngines",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-refresh", text: "System update Engines" } ),
				body: {
					$components: [
						icon( { icon: "fa fa-spinner fa-spin", text: "Checking for updates." } )
					]
				}
			}
		);
		this._startUpdate();
	},


	_startUpdate: function () {
		apiRequest({
			action: "/system/update_engines",
			callbacks: {
				200: function() {
					main._renderBusySystem( { behavior: "engines_update" } )
				},
				405: function() {
					systemUpdateEngines._alreadyUpToDate();
				}
			}
		});
	},


	_alreadyUpToDate: function () {

		modal._live(
			{
				header: icon({icon: "fa fa-refresh", text: "Update engines"}),
				body: {
					class: "clearfix",
					$components: [
						{ $text: "Engines is already up-to-date." },
						button( {
							onclick: systemMenu._live,
							icon: "fa fa-check",
							text: "OK",
							wrapperClass: "pull-right"
						} )
					]
				}
			}
		);
	},

};

var $systemSshKeys = {

	$cell: true,
	id: "systemSshKeys",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-key", text: "System system SSH Keys" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemControlPanel._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					{
						$components: [
							button( { onclick: systemSshKeys._generatePrivate,
							title: "Generate and download private key",
								icon: "fa fa-user-secret", text: "Private key"	} ),
							{ $type: "hr" },
							{ $type: "label", $text: "Public key" },
							{
								class: "clearfix",
								$components: [
									button( { onclick: systemSshKeysUploadPublic._live,
										icon: "fa fa-upload", text: "Upload",
										title: "Upload public key",
										wrapperClass: "pull-right-md"	} ),
									button( { onclick: systemSshKeys._downloadPublic,
										icon: "fa fa-download", text: "Download",
										title: "Upload private key",
										wrapperClass: "pull-left-md"	} ),
								]
							}
						]
					}
				]
			}
		} );

	},


	_generatePrivate: function () {
		apiRequest( {
			action: "/system/ssh_keys/private",
		} );
	},


	_downloadPublic: function () {
		apiRequest( {
			action: "/system/ssh_keys/public",
		} );
	},

};

var $systemRegionLocale = {

	$cell: true,
	id: "systemRegionLocale",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-comment-o", text: "System locale edit" } ),
				body: {
					$components: [
						{
							id: "systemRegionLocaleForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [ systemRegionLocale._form(localeData) ];
							},
						}
					]
				}
			}
		);
		this._loadLocale();
	},

	_loadLocale: function () {
		apiRequest({
			action: "/system/locale",
			callbacks: {
				200: function(response) {
					systemRegionLocaleForm._refresh(response);
				},
			}
		});
	},


	_form: function (localeData) {
		return form ( {
			components: [
				formField( {
					type: "country",
					name: "data[country_code]",
					label: "Country",
					value: localeData.country_code
				} ),
				formField( {
					type: "language",
					name: "data[lang_code]",
					label: "Language",
					value: localeData.lang_code
				} ),
				formCancel ( { onclick: systemRegion._live } ),
				formSubmit(),
			],
			action: "/system/locale",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemRegion._live();
				},
			}
		});

	},

};

var $systemRegionTimezone = {

	$cell: true,
	id: "systemRegionTimezone",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-clock-o", text: "System timezone edit" } ),
				body: {
					$components: [
						{
							id: "systemRegionTimezoneForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (timezoneData) {
								this.$components = [ systemRegionTimezone._form(timezoneData) ];
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
			action: "/system/timezone",
			callbacks: {
				200: function(response) {
					systemRegionTimezoneForm._refresh(response);
				},
			}
		});
	},


	_form: function (timezoneData) {
		return form ( {
			components: [
				formField( {
					type: "timezone",
					name: "data[timezone]",
					label: "Country",
					value: timezoneData.timezone
				} ),
				formCancel ( { onclick: systemRegion._live } ),
				formSubmit(),
			],
			action: "/system/timezone",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemRegion._live();
				},
			}
		});

	},

};

var $systemServiceCertificates = {

	$cell: true,
	id: "systemServiceCertificates",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-shield", text: "System service certificates" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemCertificates._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{

							id: "systemServiceCertificatesContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							$update: function () {
								this.$components = systemServiceCertificates._serviceCertificates( this._data );
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
			action: "/system/service_certificates",
			callbacks: {
				200: function( data ) {
					systemServiceCertificatesContent._render( data );
				},
			}
		});
	},


	_serviceCertificates: function( data ) {

		return [
			{
	      $type: "table",
	      $components: data.map( function( serviceCertificate, i ) {
	        var serviceCertificatePath = serviceCertificate.cert_name ? serviceCertificate.store_name + "/" + serviceCertificate.cert_name : "";
	  			return {
	          $type: "tr",
	  				$components: [
	            {
	              $type: "td",
	              $components: [
	                button( {
	                  text: serviceCertificate.service_name,
	                  wrapperStyle: "display: inline-block;",
	                  onclick: () => {
	                    systemServiceCertificatesEdit._live( serviceCertificate )
	                  }
	                } ),
	              ]
	            },
	            {
	              $type: "td",
	              $components: [
	                {
	                  $type: "span",
	                  $text: serviceCertificatePath
	                }
	              ]
	            },
	  				]
	  			};
	  		} )
	    },
		];
	},

};

var $systemStatistics = {

	$cell: true,
	id: "systemStatistics",


	_live: function() {
		modal._live(
			{
				dialogClass: "modal-lg",
				header: icon( { icon: "fa fa-bar-chart", text: "System statistics" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemDiagnostics._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
								button( { onclick: systemStatistics._live,
									icon: "fa fa-repeat", text: "Refresh" }
								),
							]
						},
						{
							id: "systemStatisticsCharts",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (statisticsData) {
								this.$components = [ systemStatistics._charts(statisticsData) ];
							},
						}
					]
				}
			}
		);
		this._loadStatistics();
	},


	_loadStatistics: function () {
		apiRequest({
			action: "/system/statistics",
			callbacks: {
				200: function(response) {
					systemStatisticsCharts._refresh(response);
				},
			}
		});
	},

	_charts: function( statisticsData  ) {
		var chartsData = this._chartDataCalculator( statisticsData );
		return {
			class: "row",
			$components: [

				this._chart( {
					label: "System memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["systemMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Memory totals",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["totalsMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Apps memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["appsMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Services memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["servicesMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Memory totals allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["totalsMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: 100
					}
				} ),

				this._chart( {
					label: "Apps memory allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["appsMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: chartsData["appsMemoryAllocations"].labels.length * 20 + 60
					}
				} ),

				this._chart( {
					label: "Services memory allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["servicesMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: chartsData["servicesMemoryAllocations"].labels.length * 20 + 60
					}
				} ),

				this._chart( {
					label: "CPU queue",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["cpuQueue"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							legend: false,
							scales: { xAxes: [ { ticks: { beginAtZero: true } } ] },
						},
					},
					canvas: {
						height: 100
					}
				} ),

				this._chart( {
					label: "Network activity",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["networkActivity"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							scales: { xAxes: [ {  scaleLabel: { display: true, labelString: 'MB' } } ] },
						},
					},
					canvas: {
						height: chartsData["networkActivity"].labels.length * 50 + 60
					}
				} ),

				this._chart( {
					label: "Disks",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["disksUsage"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							scales: { xAxes: [ { display: false, stacked: true } ], yAxes: [ { stacked: true } ] },
							tooltips: {
								callbacks: {
									label: function(tooltipItem, data) {
                		var diskSize = data.diskSizes[tooltipItem.index];
                		if (tooltipItem.datasetIndex == 0) {
                    	return "Used: " + ( data.datasets[0].data[tooltipItem.index] * diskSize ).toFixed(1) + "GB";
                  	} else {
                    	return "Free: " + ( data.datasets[1].data[tooltipItem.index] * diskSize ).toFixed(1) + "GB";
                  	};
                 	}
								}
							},
						},
					},
					canvas: {
						height: chartsData["disksUsage"].labels.length * 20 + 40
					}
				} ),

			]
		}
	},


	_chart: function ( chartData ) {

		return {
			class: "col-sm-12 col-md-" + chartData.mdCols,
			$components: [
				{ $type: "label", $text: chartData.label },
				{
					style: "min-width: 400px; " + ( dig( chartData, "canvas", "height" ) ? "height: " + chartData.canvas.height + "px;" : null ),
					$components: [
						{
							$type: "canvas",
							$init: function () {
								new Chart( this, chartData.chart );
							},
						},
					]
				}
			]
		};

	},


	_chartDataCalculator: function (systemStatistics) {

		var stats = systemStatistics;

		var colors = function (numberOfColors) {
			var palette = [
				'#48D', // Engines blue
				'#F1AD4D', // orange
				'#999999', // grey
				'#89bf06', // green
				'#8A6EAF', // purple
				'#EFDA43', // yellow
				'#EE3434', // red
				"#A630AC", "#3650A0", "#9F1D6D", "#80C837", "#1C167A", "#A012AA",
				"#DSES9F6E", "#C11C17", "#60B6CA", "#3EE61A", "#DE5003", "#4CA82B",
				"#EFCE10", "#E27A1D", "#7F91C3", "#434187", "#228B22", "#502E72", // loads of other colors for the skinny slices
				"#575597", "#3B256D", "#A63570", "#E6AA19", "#A670B8", "#93BDE7",
				"#6F6DA7", "#A6358C", "#A2395B"
			];
			if ( numberOfColors <= palette.length ) {
				return palette.slice(0, numberOfColors);
			} else {
				for (i = 1; i < ( numberOfColors - palette.length ); i++) {
					palette.push( '#'+Math.random().toString(16).slice(-6) )
				};
				return palette;
			};
		};

		var memoryFor = function (containerType) {

			var labels = [];
			var data = [];
			var appsData = stats.container_memory_statistics.containers[containerType];
			var appsDataResult = [];

			for (var appName in appsData) {
				appsDataResult.push( [ appName, appsData[appName] ] );
			};
			appsDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			appsDataResult.forEach(function( app ) {
				var memory = app[1].current/1048576;
				if ( memory < 0 ) { memory = 0; };
				labels.push( "" + app[0] + " " + memory.toFixed(1) + "MB" );
				data.push( memory );
			} );

			if ( data.length > 17 ) {
				var othersData = data.slice( 17).reduce( function (a, b) {
					return a + b;
				} );
				var othersLabel = "" +
						labels.slice( 17 ).length +
						" " +
						( labels.slice( 17 ).length == 1 ? "other" : "others" ) +
						" " +
						othersData.toFixed(1) +
						"MB";
				labels = labels.slice( 0,17 );
				labels.push( othersLabel );
				data = data.slice( 0, 17 );
				data.push( othersData );
			};

			return {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors(data.length)
					}
				]
			};
		};

		var memoryAllocationsFor = function (containerType) {
			var containerNames = [];
			var currents = [];
			var peaks = [];
			var headrooms = [];
			var limits = [];
			var containersData = stats.container_memory_statistics.containers[containerType];

			var containersDataResult = [];

			for (var containerName in containersData) {
				containersDataResult.push( [ containerName, containersData[containerName] ] );
			};
			containersDataResult.sort(function(a, b) {
					return ( ( b[1].current / b[1].limit ) -  ( a[1].current / a[1].limit ) );
			});

			containersDataResult.forEach( function( container ) {
				var current = container[1].current;
				var maximum = container[1].maximum;
				var limit = container[1].limit;
				limits.push( limit/1048576 );
				containerNames.push( "" + container[0] + " " + limit/1048576 + "MB" );
				currents.push( current/limit );
				peaks.push( (maximum - current)/limit );
				headrooms.push( (limit - maximum)/limit );
			} );

			return {
				labels: containerNames,
				memoryLimits: limits,
				datasets:
					[ {label: 'Current', data: currents, backgroundColor: colors(3)[0] },
						{label: 'Peak', data: peaks, backgroundColor: colors(3)[1] },
						{label: 'Allocated', data: headrooms, backgroundColor: colors(3)[2] } ]
			};
		};

		var totalsMemory = function () {
			totals = stats.container_memory_statistics.containers.totals;
			applications = totals.applications.allocated/1048576;
			services = totals.services.allocated/1048576;
			return {
				labels: [ "Apps " + applications + "MB", "Services " + services + "MB" ],
				datasets: [ { data: [ applications, services ], backgroundColor: colors(2) } ]
			};
		};

		var totalsMemoryAllocations = function () {
			var labels = []
			var currents = []
			var peaks = []
			var headrooms = []
			var limits = []
			var groupsData = stats.container_memory_statistics.containers.totals;

			var groupsDataResult = [];

			for (var groupName in groupsData) {
				groupsDataResult.push( [ groupName, groupsData[groupName] ] );
			};

			groupsDataResult.forEach( function( group ) {
				group[0] = ( group[0] == "applications" ? "Apps" : "Services" );
				var current = group[1].in_use;
				var maximum = group[1].peak_sum;
				var limit = group[1].allocated;
				limits.push( limit/1048576 );

				labels.push( "" + group[0] + " " + limit/1048576 + "MB" );
				currents.push( current/limit );
				peaks.push( (maximum - current)/limit );
				headrooms.push( (limit - maximum)/limit );
			} );

			return {
				labels: labels,
				memoryLimits: limits,
				datasets:
					[ {label: 'Current', data: currents, backgroundColor: colors(3)[0] },
						{label: 'Peak', data: peaks, backgroundColor: colors(3)[1] },
						{label: 'Allocated', data: headrooms, backgroundColor: colors(3)[2] } ]
			};

		};

		var systemMemory = function () {
			total = stats.system_memory_statistics.total/1024;
			active = stats.system_memory_statistics.active/1024;
			buffers = stats.system_memory_statistics.buffers/1024;
			file_cache = stats.system_memory_statistics.file_cache/1024;
			free = stats.system_memory_statistics.free/1024;
			other = total - active - buffers - file_cache - free;
			if ( other < 0 ) { other = 0 };
			labels = 	[ "Active " + active.toFixed(1) + "MB",
									"Buffers " + buffers.toFixed(1) + "MB",
									"File cache " + file_cache.toFixed(1) + "MB",
									"Free " + free.toFixed(1) + "MB",
									"Other " + other.toFixed(1) + "MB" ];
			data = [active, buffers, file_cache, free, other];
			return { labels: labels, datasets: [ { data: data, backgroundColor: colors(5) }] };
		};

		var cpuQueue = function () {
				return {
					labels: [ "One min " + stats.cpu_statistics.one,
										"Five mins " + stats.cpu_statistics.five,
										"Fifteen mins " + stats.cpu_statistics.fifteen ],
					datasets:
						[ {
							data: [
								stats.cpu_statistics.one,
								stats.cpu_statistics.five,
								stats.cpu_statistics.fifteen
							],
							backgroundColor: colors(3)
						} ]
				};
		};

		var networkActivity = function () {
			var labels = [];
			var dataRx = [];
			var dataTx = [];

			var networkActivityData = stats.network_statistics;
			var networkActivityDataResult = [];

			for (var networkInterfaceName in networkActivityData) {
				networkActivityDataResult.push( [
					networkInterfaceName,
					networkActivityData[networkInterfaceName] ] );
			};
			networkActivityDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			networkActivityDataResult.forEach( function ( networkInterface ) {
				labels.push( networkInterface[0] );
				dataRx.push( networkInterface[1].rx / 1048576 );
				dataTx.push( networkInterface[1].tx / 1048576 );
			} );

			return {
				labels: labels,
				datasets: [
					{ label: 'Received', data: dataRx, backgroundColor: colors(2)[0] },
					{ label: 'Sent', data: dataTx, backgroundColor: colors(2)[1] }
				]
			};

		};

		var disksUsage = function () {
			var labels = [];
			var disksFree = [];
			var disksUsed = [];
			var disksSizes = [];

			var disksUsageData = stats.disk_statistics;
			var disksUsageDataResult = [];

			for (var diskName in disksUsageData) {
				disksUsageDataResult.push( [ diskName, disksUsageData[diskName] ] );
			};
			disksUsageDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			disksUsageDataResult.forEach( function ( disk ) {
				var diskSize = disk[1].blocks / 2097152;
				var diskFree = disk[1].available / 2097152;
				var diskUsed = diskSize - diskFree;
				var diskLabel = disk[0] + disk[1].type + " " + disk[1].mount + " " + diskSize.toFixed(0) + "GB";
				labels.push( diskLabel );
				disksFree.push( diskFree / diskSize );
				disksUsed.push( diskUsed / diskSize );
				disksSizes.push( diskSize );
			} );

			return {
				labels: labels,
				diskSizes: disksSizes,
				datasets: [
					{ label: 'Used', data: disksUsed, backgroundColor: colors(2)[0] },
					{ label: 'Free', data: disksFree, backgroundColor: colors(2)[1] }
				]
			};
		};

		return {
			totalsMemory: totalsMemory(),
			systemMemory: systemMemory(),
			appsMemory: memoryFor("applications"),
			appsMemoryAllocations: memoryAllocationsFor("applications"),
			servicesMemory: memoryFor("services"),
			servicesMemoryAllocations: memoryAllocationsFor("services"),
			totalsMemoryAllocations: totalsMemoryAllocations(),
	// TODO:			cpuLoad: cpuLoad(),
			cpuQueue: cpuQueue(),
			networkActivity: networkActivity(),
			disksUsage: disksUsage(),
		};
	},

};

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
												return button( { text: action.label || action.name, onclick: function () { appActionsNew._live( appName, action.name ) } });
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

var $appWebsites = {

	$cell: true,
	id: "appWebsites",

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
					icon: "fa fa-globe",
					text: "App websites"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appMenu._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appWebsitesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								this.$components = data.length ?
									data.map( ( website ) => { return button( { text: website, onclick: function() {
										openUrl( website );
									} } ); } ) :
									[ { $type: "i", $text: "None." } ]
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/apps/" + this._appName + "/websites",
			callbacks: {
				200: function( data ) {
					appWebsitesContent._refresh( data );
				},
			}
		});
	},

};

cell({

	id: "appProcesses",


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

});

cell({

	id: "appDiagnosticsServices",


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
					icon: "fa fa-compass",
					text: "App diagnostics services",
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
							id: "appDiagnosticsServicesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( appDiagnosticsServicesContent._data ) ];
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
			action: "/apps/" + this._appName + "/service_manager/report",
			callbacks: {
				200: function(response) {
					appDiagnosticsServicesContent._refresh( response );
				}
			}
		});

	},

});

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
										{ label: "Output", body: { $components: [
											button( {
												onclick: function() {
													var html = '<pre style=\'font-family: Menlo,Monaco,Consolas,"Courier New",monospace; font-size: 14px; line-height: 1.42857143; color: #333;"\'>' + $("#appLogsContentOutput").html() + '</pre>';
													var newWindow = window.open('','Engines' + appName + " output log",'width=600, height=600, location=no, toolbar=0, scrollbars=1');
													newWindow.document.title = appName + " output log"
													$(newWindow.document.body).html( html );
													newWindow.scrollTo(0,newWindow.document.body.scrollHeight);
												},
												icon: "fa fa-window-maximize",
												text: "Popup",
												wrapperClass: "clearfix",
												class: "pull-right",
												title: "Open build report in new window"
											} ),
											{ id: "appLogsContentOutput", $type: "pre", style: "white-space: pre-wrap;", $text: appLogsContent._data.stdout }
										] } },
										{ label: "Error", body: { $components: [
											button( {
												onclick: function() {
													var html = '<pre style=\'font-family: Menlo,Monaco,Consolas,"Courier New",monospace; font-size: 14px; line-height: 1.42857143; color: #333;"\'>' + $("#appLogsContentError").html() + '</pre>';
													var newWindow = window.open('','Engines' + appName + " error log",'width=600, height=600, location=no, toolbar=0, scrollbars=1');
													newWindow.document.title = appName + " error log"
													$(newWindow.document.body).html( html );
													newWindow.scrollTo(0,newWindow.document.body.scrollHeight);
												},
												icon: "fa fa-window-maximize",
												text: "Popup",
												wrapperClass: "clearfix",
												class: "pull-right",
												title: "Open build report in new window"
											} ),
											{ id: "appLogsContentError", $type: "pre", style: "white-space: pre-wrap;", $text: appLogsContent._data.stderr }
										] } }
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

cell({

	id: "appContainer",

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
					icon: "fa fa-cube",
					text: "App diagnostics container",
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
							onclick: function () { appContainer._live( appName ); }
						} ),
						{
							id: "appContainerContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( appContainerContent._data ) ];
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
			action: "/apps/" + this._appName + "/container",
			callbacks: {
				200: function(response) {
					appContainerContent._refresh( response );
				}
			}
		});

	},

});

var $appAbout = {

	$cell: true,
	id: "appAbout",

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
					icon: "fa fa-info-circle",
					text: "App about"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appMenu._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{
							id: "appAboutContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								var version = dig( data, "software", "display", "version" );
								var websiteUrl = dig( data, "software", "display", "url" );
								var licenseUrl = dig(data, "software", "license", "url" );

								this.$components = [
									{
										class: "clearfix",
										$components: [
											button( { icon: "fa fa-external-link", text: "Website", class: "pull-left-md", onclick: () => { websiteUrl ? openUrl( websiteUrl ) : alert("Not available."); } } ),
											button( { icon: "fa fa-external-link", text: "License", class: "pull-right-md", onclick: () => { licenseUrl ? openUrl( licenseUrl ) : alert("Not available."); } } )
										]
									},
									{
										class: "panel panel-default",
										style: "margin: 15px; box-shadow: 0 2px 5px rgba(0,0,0,.5);",
										$components: [
											{
												class: "panel-heading",
												style: "background-color: #FFF; background-image: none; border-top-left-radius: 3px !important; border-top-right-radius: 3px !important;",
												$components: [
													{
														$type: "h5",
														$text: (
															dig( data, "software", "display", "title" ) ||
															dig( data, "software", "display", "label" )
														) +
														( version ? " (" + version + ")" : "" )
													},
												]
											},
											{
												class: "panel-body",
												$components: [
													markdown( dig( data, "software", "display", "description" ) )
												]
											}
										]
									},
									button( { icon: "fa fa-camera-retro", class: "pull-right-md", text: "Icon", onclick: () => { appIcon._live( appName ); } } ),
								];
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/apps/" + this._appName + "/about",
			callbacks: {
				200: function( data ) {
					appAboutContent._refresh( data );
				},
			}
		});
	},

};

var $appNetworkEdit = {

	$cell: true,
	id: "appNetworkEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-sitemap", text: "App network edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appNetworkEdit._appName },
						{ $type: "hr" },
						{
							id: "appNetworkEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function () {
								this.$components = [ appNetworkEdit._form() ];
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
			action: "/apps/" + this._appName + "/network",
			callbacks: {
				200: function(response) {
					appNetworkEdit._data = response
					appNetworkEditForm._refresh();
				},
			}
		});
	},


	_form: function () {
		var data = appNetworkEdit._data;
		return form ( {
			components: [
				formField( {
					type: "select",
					name: "data[http_protocol]",
					label: "HTTP Protocol",
					collection: availableHttpProtocols( data.default_http_protocol ),
					value: data.http_protocol
				}),
				formField( {
					id: "appNetworkEditFormField_host_name",
					name: "data[host_name]",
					label: "Host name",
					value: data.host_name,
					onchange: appNetworkEdit._checkFqdnReserved,
				}),
				formField( {
					id: "appNetworkEditFormField_domain_name",
					type: "select",
					name: "data[domain_name]",
					label: "Domain name",
					value: data.domain_name,
					collection: data.available_domain_names,
					onchange: appNetworkEdit._checkFqdnReserved,
				} ),
				formCancel ( { onclick: () => { appNetwork._live( appNetworkEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/network",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appNetwork._live( appNetworkEdit._appName );
				},
			}
		});

	},

	_checkFqdnReserved: function () {
		var fqdn = $("#appNetworkEditFormField_host_name").val() + '.' + $("#appNetworkEditFormField_domain_name").val();
		if( $.inArray( fqdn, appNetworkEdit._data.reserved_fqdns ) > -1 ) {
			$("#appNetworkEditFormField_host_name")[0].setCustomValidity(
				fqdn + " is already in use."
			);
		} else {
			$("#appNetworkEditFormField_host_name")[0].setCustomValidity('')
		};
	},

};

var $appNetwork = {

	$cell: true,
	id: "appNetwork",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-sitemap", text: "App network" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appNetwork._appName ); }
								} ),
								{ $type: "h4", $text: appNetwork._appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appNetworkContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appNetwork._network( data ) ];
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
			action: "/apps/" + this._appName + "/network",
			callbacks: {
				200: function(response) {
					appNetworkContent._refresh(response);
				},
			}
		});
	},


	_network: function ( data ) {
		return {
			$components: [
				dataList({
					class: "dl-horizontal",
					items: [
						{ label: "HTTP Protocol", data: data.http_protocol },
						{ label: "Host name", data: data.host_name },
						{ label: "Domain name", data: data.domain_name },
					]
				}),
				button( {
					icon: "fa fa-edit",
					text: "Edit",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () { appNetworkEdit._live( appNetwork._appName ); },
				} ),
			]
		};

	},

};

var $appMenu = {

	$cell: true,
	id: "appMenu",

	_appName: null,
	_appData: null,


	_live: function( appName ) {

		this._appName = appName;
		this._appData = systemApps._dataFor( appName );
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var appData = this._appData;
		var state = appData.state;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-mobile",
					text: "App menu"
				} ),
				body: {
					id: "appMenuContent",
					$components: [
						{
							class: "clearfix",
							$components: [
								{ $type: "h4", class: "pull-left-md", $text: appName },
								button( {
									icon: "fa fa-cogs",
									text: "Control panel",
									class: "pull-right-md",
									onclick: function () { appControlPanel._live( appName ); }
								} ),
							]
						},
						{ $type: "hr" },
						appMenu._oomMessage( appData.had_oom ),
						{
							style: "min-height: 85.8px;",
							$components: [
								appMenu._needsRestartMessage( appData.restart_required ),
								appMenu._stateDisplay( appData ),
								appMenu._instructionMessage( state ),
								appMenu._stateInstructions( state ),
							]
						},
						{ $type: "hr" },
						appMenu._websites(),
						button( {
							icon: "fa fa-info-circle",
							text: "About",
							class: "pull-right-md",
							onclick: function () { appAbout._live(appName); },
						} )

					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/apps/" + this._appName + "/websites",
			callbacks: {
				200: function( data ) {
					appMenuWebsites._refresh( data );
				},
			}
		});
	},


	_websites: function () {

		var appName = this._appName;

		return {
			id: "appMenuWebsites",

			_refresh: function( websites ) {
				this.$components = [
					button( $.extend( {
		 				icon: "fa fa-globe",
		 				text: "Websites",
		 				class: "pull-left-md",
		 				onclick: function () { appWebsites._live( appName ); },
		 			}, websites.length == 0 ? { disabled: "disabled", title: 'No websites' } : {} ) )
				]
			}
		};
	},


	_oomMessage: function ( hadOom ) {

		return {

			id: "appMenuOomMessage",
			_hadOom: null,

			$init: function () {
				this._hadOom = hadOom;
			},

			$update: function () {
				this.$components = [
					this._hadOom ? {
						$components: [
							{
								class: "clearfix",
								$components: [
									{
										class: "pull-left",
										style: "padding-top: 10px;",
										$components: [
											icon( { icon:"fa fa-warning", text: "Ran out of memory", style: "color: red;" } ),
										]
									},
									button( {
										class: "pull-right",
										icon: "fa fa-check",
										text: "OK",
										onclick: appMenu._clearOom
									} ),
								]
							},
							{ $type: "hr" },
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._appState = state;
			}

		};
	},


	_needsRestartMessage: function( needsRestart ) {

		return {

			id: "appMenuNeedsRestartMessage",
			_needsRestart: null,

			$init: function () {
				this._needsRestart = needsRestart;
			},

			$update: function () {
				this.$components = [
					this._needsRestart ? {
						$type: "p",
						$components: [
							icon( {
								icon:"fa fa-warning", text: "Needs restart", style: "color: red;"
							} )
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._needsRestart = state;
			}

		};
	},


	_handleContainerEvent: function( event ) {

		if ( event.container_type == "app" && this._appName == event.container_name && typeof appMenuContent !== 'undefined' ) {
			appMenuStateInstructions._refresh( event.status.state );
			appMenuStateDisplay._refresh( event.status );
			appMenuNeedsRestartMessage._refresh( event.status.restart_required );
			appMenuOomMessage._refresh( event.status.had_oom );
		};
	},


	_instructionMessage: function () {

		return {
			style: "font-size: 12px; display: inline-block;",
			id: "appMenuInstructionMessage",
			_showMessage: function ( message ) {
				this.$components = [ {
					$html: " &nbsp; " + message,
					$init: function () {
						setTimeout( function () {
							$( this ).remove();
						}.bind( this ), 2000 );
					}
				} ];
			}
		};

	},


	_stateInstructions: function( state ) {

		return {
			id: "appMenuStateInstructions",
			_appState: null,
			$init: function () {
				this._appState = state;
			},
			$update: function () {
				this.$components = [
					appMenu._containerInstructions(this._appState),
				];
			},
			_refresh: function( state ) {
				this._appState = state;
			}
		};

	},


	_stateDisplay: function( appData ) {

		return {
			id: "appMenuStateDisplay",
			style: "display: inline-block;",
			_appData: null,
			$init: function () {
				this._appData = appData;
			},
			$update: function () {
				this.$components = [
					{
						$type: "h4",
						style: "margin-left: 17px;",
						title: "Container state is " + this._appData.state +
							( ( this._appData.state == "stopped" && this._appData.why_stop ) ?
							" (" + this._appData.why_stop + ")." : "." ),
						$components: [
							containerStateIcon(this._appData.state),
							{
								$type: "span",
								$text: this._appData.state
							}
						]
					}
				];
			},
			_refresh: function( appData ) {
				this._appData = appData;
			}
		};

	},


	_instruct: function (instruction) {

		appMenuInstructionMessage._showMessage("Sending " + instruction + " instruction");
		var appName = this._appName;
		apiRequest( {
			action: "/apps/" + appName + "/instruct",
			params: { instruction:  instruction },
			callbacks: {
				200: function(e) {
					if ( instruction == "reinstall" ) {
						system._live();
						// Causes build progress to open
					}	else if ( appMenu._appName == appName ) {
						// Check matching app name because a different app menu may have
						// been opened by user during wait for instruction response
						appMenuInstructionMessage._showMessage("Sent " + instruction + " instruction");
					};
				}
			},
		} );

	},


	_containerInstructions: function(state) {

		var appName = this._appName;
		if (state == "running" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('restart'); }, icon: "fa fa-play-circle", text: "Restart", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('pause'); }, icon: "fa fa-pause", text: "Pause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "stopped" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('start'); }, icon: "fa fa-play", text: "Start", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('destroy'); }, icon: "fa fa-bomb", text: "Destroy", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('recreate'); }, icon: "fa fa-wrench", text: "Recreate", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "paused" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('unpause'); }, icon: "fa fa-pause-circle", text: "Unpause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "nocontainer" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('create'); }, icon: "fa fa-wrench", text: "Create", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('reinstall'); }, icon: "fa fa-plus-circle", text: "Reinstall", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appUninstall._live( appName ); }, icon: "fa fa-minus-square", text: "Uninstall", wrapperStyle: "display: inline-block"})
				]
			};
		} else {
			return { style: "height: 46px;" };
		};
	},


	_clearOom: function () {
		var appName = this._appName;
		apiRequest( {
			action: "/apps/" + appName + "/had_oom",
			method: "DELETE",
			callbacks: {
				200: function(e) {
					system._live( function () {
						appMenu._live( appName );
					} );
				}
			},
		} );
	}

};

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
									report = {
										$components: [
											{
												id: "appBuildReportDisplayReportHtml",
												$components: [
													markdown( this._buildReport )
												]
											},
											{ $type: "hr" },
											button( {
												onclick: function() {
													var html = '<div style=\'font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; font-size: 14px; line-height: 1.42857143; color: #333;"\'>' + $("#appBuildReportDisplayReportHtml").html() + '</div>';
													var newWindow = window.open('','Engines app build report','width=600, height=600, location=no, toolbar=0, scrollbars=1');
													newWindow.document.title = appName + " build report"
													$(newWindow.document.body).html( html );
												},
												icon: "fa fa-window-maximize",
												text: "Popup",
												class: "pull-right",
												title: "Open build report in new window"
											} ),
										]
									}
								}
								this.$components = [ report ];
							}
						},
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
					appBuildReportDisplay._refresh( response.build_report );
				}
			}
		});

	},

};

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
							icon: "fa fa-cube",
							text: "Container",
							onclick: function () { appContainer._live(appName); },
						} ),

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

						// button( {
						// 	icon: "fa fa-question-circle-o",
						// 	text: "Environment",
						// 	onclick: function () { appDiagnosticsEnvironment._live(appName); },
						// } ),

						{ $type: "hr" },

						button( {
							icon: "fa fa-compass",
							text: "Services",
							onclick: function () { appDiagnosticsServices._live(appName); },
						} ),

						{ $type: "hr" },

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

var $appControlPanel = {

	$cell: true,
	id: "appControlPanel",

	_appName: null,


	_live: function (appName) {

		authCheck(); // this modal does not call api for data, so do fake call to check if auth'd

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-cogs",
					text: "App control panel"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appMenu._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							class: "row",
							$components: [
								{
									class: "col-sm-6",
									$components: [
										button( {
											icon: "fa fa-crosshairs",
											text: "Actions",
											onclick: function () {
												if ( systemApps._dataFor(appName).state == "running" ) {
													appActions._live(appName);
												} else {
													alert("App must be running to perform actions.")
												}
											},
										} ),
										{ $type: "hr" },
										button( {
											icon: "fa fa-sitemap",
											text: "Network",
											onclick: function () { appNetwork._live(appName); },
										} ),
										button( {
											icon: "fa fa-microchip",
											text: "Memory",
											onclick: function () { appMemory._live(appName); },
										} ),
										{ $type: "hr" },
									]
								},
								{
									class: "col-sm-6",
									$components: [
										button( {
											icon: "fa fa-question-circle-o",
											text: "Environment",
											onclick: function () { appEnvironmentVariables._live(appName); },
										} ),
										button( {
											icon: "fa fa-compass",
											text: "Services",
											onclick: function () { appServices._live(appName); },
										} ),
										{ $type: "hr" },
										button( {
											icon: "fa fa-list-ol",
											text: "Build report",
											onclick: function () { appBuildReport._live(appName); },
										} ),
										button( {
											icon: "fa fa-stethoscope",
											text: "Diagnostics",
											onclick: function () { appDiagnostics._live(appName); },
										} ),
									]
								},
							]
						}
					]
				}
			}
		);

	},

};

cell({

	id: "appMemory",

	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App memory" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appMemory._appName ); }
								} ),
								{ $type: "h4", $text: appMemory._appName },
							]
						},
						{ $type: "hr" },
						appMemory._memoryUsage(),
						{ $type: "hr" },
						appMemory._memoryAllocated(),
					]
				}
			}
		);
		this._load();
	},


	_load: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/memory",
			callbacks: {
				200: function(response) {
					appMemoryAllocated._refresh(response);
				},
			}
		});

	},

	_memoryUsage: function () {

		var appName = this._appName;

		return {
			id: "appMemoryUsage",

			$components: [
				button( {
					icon: "fa fa-pie-chart",
					text: "Usage",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () {
						appMemoryUsage.$components = [
							{ $type: "p", $components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							] }
						];
						appMemoryUsage._load();
					}
				} )
			],

			_load: function () {

				apiRequest({
					action: '/system/statistics/container_memory',
					callbacks: {
						200: function(response) {
							appMemoryUsage._refresh( response );
						},
					}
				});

			},



			_refresh: function( data ) {

				var appMemoryUsageData = data.containers.applications[appName];

				this.$components = [
					appMemoryUsageData && appMemoryUsageData.current ? dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Current", data: (appMemoryUsageData.current/1024/1024).toFixed(1) + " MB" },
							{ label: "Peak", data: (appMemoryUsageData.maximum/1024/1024).toFixed(1) + " MB" },
						]
					} ) :
					{ $type: "i", $text: "No memory usage."},
				];
			}

		};
	},

	_memoryAllocated: function () {

		var appName = this._appName;

		return {
			id: "appMemoryAllocated",

			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
			],

			_refresh: function( data ) {
				this.$components = [
					dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Allocated", data: data.memory + " MB" },
						]
					} ),
					button({
						wrapperClass: "clearfix",
						class: "pull-right-md",
						icon: "fa fa-edit",
						text: "Edit",
						onclick: function () { appMemoryEdit._live( appName ); }
					})
				];
			}

		};
	},


});

var $appIconEdit = {

	$cell: true,
	id: "appIconEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App icon edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appIconEdit._appName },
						{ $type: "hr" },
						{
							id: "appIconEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appIconEdit._form( data ) ];
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
			action: "/apps/" + this._appName + "/icon",
			callbacks: {
				200: function(response) {
					appIconEditForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "url",
					name: "data[icon_url]",
					label: "Icon URL",
					value: data.icon_url
				}),
				formCancel ( { onclick: () => { appIcon._live( appIconEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/icon",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appIcon._live( appIconEdit._appName );
				},
			}
		});

	},

};

var $appServices = {

	$cell: true,
	id: "appServices",

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
					icon: "fa fa-compass",
					text: "App services",
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
							icon: "fa fa-plus",
							text: "New",
							onclick: () => {
								appServicesNew._live( appName );
							}
						} ),
						{ $type: "hr" },
						{
							id: "appServicesContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "label", $text: "Persistent" },
									appServices._persistentServices(),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									appServices._nonpersistentServices(),
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

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services",
			callbacks: {
				200: function(response) {
					appServicesContent._refresh( response );
				}
			}
		});

	},


	_persistentServices: function () {
		var owned = appServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin != "shared" } );
		var shared = appServicesContent._data[ "persistent" ].filter( function( service ) { return service.origin == "shared" } );
		return {
			$components: [
				{ $components: appServices._persistentServicesButtons( owned ) },
				shared.length ? {
					$components: [
						{ $type: "small", $text: "Shared" },
						{ $components: appServices._persistentServicesButtons( shared ) }
					]
				} : {}
			]
		};
	},

	_persistentServicesButtons: function( services ) {
		return services.map( function( service ) {
			return button( {
				text: service.label || service.name,
				onclick: function () {
					appServicesPersistent._live(
						appServices._appName,
						service.publisher_namespace,
						service.type_path,
						service.service_handle );
				}
			} );
		} )
	},


	_nonpersistentServices: function () {
		return {
			$components: appServicesContent._data[ "non_persistent" ].map( function( nonpersistentService ) {
				return button( {
					text: nonpersistentService.label || nonpersistentService.name,
					onclick: function () {
						appServicesNonpersistent._live(
							appServices._appName,
							nonpersistentService.publisher_namespace,
							nonpersistentService.type_path,
							nonpersistentService.service_handle );
					}
				} );
			} )
		};
	},


};

cell({

	id: "appActionsResult",

	_appName: null,
	_actionData: null,
	_responseData: null,

	_live: function ( appName, actionData, responseData ) {
		this._appName = appName;
		this._actionData = actionData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var appName = this._appName;
		var actionData = this._actionData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App action result",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appActions._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: actionData.label || actionData.name },
						{ $type: "p", $text: actionData.description },
						appActionsResult._renderResult( actionData, responseData )
					]
				}
			}
		);

	},

	_renderResult: function ( actionData, responseData ) {
		switch ( actionData.return_type ) {
			case "plain_text":
				return { class: "panel panel-default", $components: [ { class: "panel-body", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) } ] };
				break;
			case "code":
				return { class: "pre", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) };
				break;
			case "json":
				return pp( responseData );
				break;
			// case "file":
			// 	return pp( responseData );
			// 	break;
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed action." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

});

cell({

	id: "appActionsNew",

	_live: function (appName, actionName) {

		this._appName = appName;
		this._actionName = actionName;
		this._load();

	},


	_show: function ( data ) {

		var appName = this._appName;
		// var data = this._data;

		var hasVariables = data.variables && data.variables.length;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App action",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{ $type: "h4", $text: data.label || data.name },
						{ $type: "p", $text: data.description },
						hasVariables ?
						appActionsNew._form( data ) :
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
					]
				}
			}
		);

		if ( !hasVariables ) { this._postWithoutParams( data ) };

	},


	_postWithoutParams: function ( data ) {
		var appName = this._appName;
		apiRequest({
			action: "/apps/" + appName + "/action",
			params: { actionator_name: data.name },
			method: "POST",
			callbacks: {
				200: function( response ) {
					appActionsResult._live( appName, data, response )
				},
			}
		});
	},

	_load: function () {
		apiRequest({
			action: "/apps/" + this._appName + "/action",
			params: { actionator_name: this._actionName },
			callbacks: {
				200: function(response) {
					appActionsNew._show( response );
				}
			}
		});
	},

	_form: function ( data ) {

		var appName = this._appName;

		return form( {
			components: [
				inDevelopment ? pp(data) : {},
				formField( {
					type: "hidden",
					name: "actionator_name",
					value: data.name
				} ),
				{
					$components: ( data.variables || [] ).map( function ( variable ) {
						variable.name_prefix = "variables";
						return enginesField( variable );
					} )
				},
				formCancel ( {
					onclick: function () {
						appActions._live( appName );
					}
				} ),
				formSubmit(),
			],
			action: "/apps/" + appName + "/action",
			method: "POST",
			callbacks: {
				200: function(response) {
					appActionsResult._live( appName, data, response );
				},
			}
		} )

	}


});

var $appMemoryEdit = {

	$cell: true,
	id: "appMemoryEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App memory edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appMemoryEdit._appName },
						{ $type: "hr" },
						{
							id: "appMemoryEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appMemoryEdit._form( data ) ];
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
			action: "/apps/" + this._appName + "/memory",
			callbacks: {
				200: function(response) {
					appMemoryEditForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "number",
					name: "data[memory]",
					label: "Memory (MB)",
					value: data.memory
				}),
				formCancel ( { onclick: () => { appMemory._live( appMemoryEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appMemory._live( appMemoryEdit._appName );
				},
			}
		});

	},

};

var $appIcon = {

	$cell: true,
	id: "appIcon",

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
					icon: "fa fa-camera-retro",
					text: "App icon"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appAbout._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{
							id: "appIconContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								var iconUrl = data.icon_url;
								this.$components = [
									{
										$components: [
											iconUrl ? {
												$components: [
													dataList({
														class: 'dl-horizontal',
														items: [
															{
																label: "Icon URL",
																data: {
																	$components: [
																		{ $type: "p",
																			$text: iconUrl,
																		},
																		{
																			$type: "img",
																			src: iconUrl,
																			height: "64",
																			width: "64"
																		}
																	]
																},
															}
														]
													}),
												],
											} : {
												$type: 'i',
												$text: "None"
											}
										]
									},
									{
										class: "clearfix",
										$components: [
											button( { icon: "fa fa-edit", text: "Edit", class: "pull-right-md", onclick: () => { appIconEdit._live( appName ); } } )
										]
									},
								];
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/apps/" + this._appName + "/icon",
			callbacks: {
				200: function( data ) {
					appIconContent._refresh( data );
				},
			}
		});
	},

};

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

var $appServicesNonpersistentRegistration = {

	$cell: true,
	id: "appServicesNonpersistentRegistration",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,
	_data: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-tag",
					text: "App non-persistent service registration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServicesNonpersistent._live( appName, publisherNamespace, typePath, serviceHandle ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesNonpersistentRegistration._data.label },
						{ $type: "p", $text: appServicesNonpersistentRegistration._data.description },
						{ $type: "hr" },
						button( {
							text: "Register",
							onclick: function () { appServicesNonpersistentRegistration._registration( "PUT" ) }
						} ),
						button( {
							text: "Deregister",
							onclick: function () { appServicesNonpersistentRegistration._registration( "DELETE" ) }
						} ),
						button( {
							text: "Reregister",
							onclick: function () { appServicesNonpersistentRegistration._registration( "PATCH" ) }
						} ),
					]
				}
			}
		);

	},

	_registration: function( method ) {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + appName + "/service_manager/nonpersistent/registration/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: method,
			callbacks: {
				200: function() {
					appServicesNonpersistent._live( appName, publisherNamespace, typePath, serviceHandle );
				}
			},
		});

	},

};

var $appServicesNonpersistentEdit = {

	$cell: true,
	id: "appServicesNonpersistentEdit",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,
	_data: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App non-persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesNonpersistentEdit._data.label },
						{ $type: "p", $text: appServicesNonpersistentEdit._data.description },
						{ $type: "hr" },
						appServicesNonpersistentEdit._form(),
					]
				}
			}
		);

	},

	_form: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;
		var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );

		return form ( {
			components: [
				{
					$components: mutableParams.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					})
				},
				formCancel ( { onclick: () => {
					appServicesNonpersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				} } ),
				formSubmit(),
			],

			action: "/apps/" + this._appName + "/service_manager/nonpersistent/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appServicesNonpersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				}
			}
		});
	}

};

var $appServicesNonpersistentNew = {

	$cell: true,
	id: "appServicesNonpersistentNew",

	_appName: null,

	_live: function( appName, publisherNamespace, typePath ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._show();

	},

	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App create new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{
									id: "appServicesNonpersistentNewContent",
									_data: null,

									$components: [
										icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
									],

									$init: appServicesNonpersistentNew._load(),

									_refresh: function (data) {
										this._data = data
									},

									$update: function () {
										this.$components = [
											{ $type: "h4", $text: appServicesNonpersistentNewContent._data.label },
											{ $type: "p", $text: appServicesNonpersistentNewContent._data.description },
											{ $type: "hr" },
											appServicesNonpersistentNew._form(),
										];
									},

								},

							],

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/nonpersistent/new",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath
			},
			callbacks: {
				200: function(response) {
					appServicesNonpersistentNewContent._refresh( response );
				}
			}
		});

	},


	_form: function () {
		return form ( {
			components: [
				formField( {
					name: "publisher_namespace",
					type: "hidden",
					value: appServicesNonpersistentNewContent._data.publisher_namespace
				} ),
				formField( {
					name: "type_path",
					type: "hidden",
					value: appServicesNonpersistentNewContent._data.type_path
				} ),
				{
					$components: appServicesNonpersistentNewContent._data.params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesNonpersistentNew._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/nonpersistent/",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesNonpersistentNew._appName );
				},
			}
		});
	}

};

var $appServicesPersistentEdit = {

	$cell: true,
	id: "appServicesPersistentEdit",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,
	_data: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App edit persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesPersistentEdit._data.label },
						{ $type: "p", $text: appServicesPersistentEdit._data.description },
						{ $type: "hr" },
						appServicesPersistentEdit._form(),
					]
				}
			}
		);

	},

	_form: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;
		var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );

		return form ( {
			components: [
				{
					$components: mutableParams.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					})
				},
				formCancel ( { onclick: () => {
					appServicesPersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				} } ),
				formSubmit(),
			],

			action: "/apps/" + this._appName + "/service_manager/persistent/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appServicesPersistent._live(
						appName, publisherNamespace, typePath, serviceHandle
					);
				}
			}
		});
	}

};

var $appServicesPersistentDelete = {

	$cell: true,
	id: "appServicesPersistentDelete",
	_appName: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		modal._live(
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App delete persistent service"
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						form( {
							components: [
								formField( {
									type: "checkbox",
									name: "data[delete_data]",
									label: "Delete data",
									class: "text-center"
								} ),
								formCancel ( {
									onclick: function () {
										appServicesPersistent._live(
											appName, publisherNamespace, typePath, serviceHandle
										);
									}
								} ),
								formSubmit(),
							],
							method: "DELETE",
							action: "/apps/" + this._appName + "/service_manager/persistent/",
							params: {
								publisher_namespace: publisherNamespace,
								type_path: typePath,
								service_handle: serviceHandle
							},
							callbacks: {
								200: function(response) {
									appServices._live( appName );
								},
							},

						} )
					]
				}
			}
		);
	},

};

var $appServicesPersistentShareExisting = {

	$cell: true,
	id: "appServicesPersistentShareExisting",

	_appName: null,
	_data: null,
	_index: null,


	_live: function( appName, data, index ) {

		this._appName = appName;
		this._data = data;
		this._index = index;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App share existing persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentShareExisting._data.label },
								{ $type: "p", $text: appServicesPersistentShareExisting._data.description },
								{ $type: "hr" },
								appServicesPersistentShareExisting._form(),
							],

						},
					]
				}
			}
		);

	},


	_form: function () {

		var serviceConsumer = this._data.shareable[ this._index ];

		var publisherNamespace = this._data.publisher_namespace;
		var typePath = this._data.type_path;
		var parent = serviceConsumer.parent;
		var serviceHandle = serviceConsumer.service_handle;

		var params = this._data.params.filter( function( param ) {
			return param.immutable != true;
		} ).map( function( param ) {
			param.value = serviceConsumer.variables[ param.name ];
			return param;
		} );

		return form ( {
			components: [
				{ $type: "strong", $text: "Share " + ( serviceConsumer.parent == serviceConsumer.service_handle ? serviceConsumer.parent : serviceConsumer.parent + " - " + serviceConsumer.service_handle ) },
				{ $type: "hr" },
				{
					$components: params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentShareExisting._appName ); } } ),
				formSubmit( params.length > 0 ? {} : { init: function(button) { button.click(); } } ),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/share_existing",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				parent: parent,
				service_handle: serviceHandle
			},
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentShareExisting._appName );
				},
			}
		});
	}

};

var $appServicesPersistentNewType = {

	$cell: true,
	id: "appServicesPersistentNewType",

	_appName: null,
	_publisherNamespace: null,
	_persistentService: null,


	_live: function( appName, publisherNamespace, typePath ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							id: "appServicesPersistentNewTypeContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: function () { appServicesPersistentNewType._load() },

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									appServicesPersistentNewType._form(),
								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/available",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
			},
			callbacks: {
				200: function(response) {
					appServicesPersistentNewTypeContent._refresh( response );
				}
			}
		});

	},


	_form: function () {

		return form ( {
			components: [
				formField( {
					name: "data[create_type]",
					id: "appServicesPersistentNewTypeCreateType",
					label: false,
					title: "Create type",
					type: "select",
					value: "create",
					collection: serviceConsumerCreateType( appServicesPersistentNewTypeContent._data )
				} ),
				(
					appServicesPersistentNewTypeContent._data.shareable == 0 ? {} :
					formField( {
						name: "data[shareable_service]",
						label: false,
						type: "select",
						collection: appServicesPersistentNewTypeContent._data.shareable.map(
							function( service, i ) {
								return [ i,	service.parent + (
										service.parent == service.service_handle ? "" :
										" - " + service.service_handle
									)
								];
							}
						),
						dependOn: {
							input: "appServicesPersistentNewTypeCreateType",
							value: "share"
						}
					} )
				),
				(
					appServicesPersistentNewTypeContent._data.adoptable == 0 ? {} :
					formField( {
						name: "data[adoptable_service]",
						label: false,
						type: "select",
						collection: appServicesPersistentNewTypeContent._data.adoptable.map(
							function( service, i ) {
								return [ i,	service.parent + (
										service.parent == service.service_handle ? "" :
										" - " + service.service_handle
									)
								];
							}
						),
						dependOn: {
							input: "appServicesPersistentNewTypeCreateType",
							value: "adopt"
						}
					} )
				),
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentNewType._appName ); } } ),
				formSubmit( {
					text: "Next",
					icon: "fa fa-arrow-right",
				}),
			],
			init: function ( form ) {
				$(form).submit( function( e ) {

					var formData = new FormData( form );
					var serviceConsumerParams = appServicesPersistentNewTypeContent._data.params;
					switch ( formData.get("data[create_type]") ) {
						case "create":
							appServicesPersistentCreateNew._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data
							);
							break;
						case "share":
							appServicesPersistentShareExisting._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data,
								parseInt( formData.get("data[shareable_service]") )
							);
							break;
						case "adopt":
							appServicesPersistentAdoptOrphan._live(
								appServicesPersistentNewType._appName,
								appServicesPersistentNewTypeContent._data,
								parseInt( formData.get("data[adoptable_service]") )
							);
							break;
					};
					e.preventDefault();
					return false;
				} );
			},

		} );
	}

};

var $appServicesPersistentAdoptOrphan = {

	$cell: true,
	id: "appServicesPersistentAdoptOrphan",

	_appName: null,
	_data: null,
	_index: null,


	_live: function( appName, data, index ) {

		this._appName = appName;
		this._data = data;
		this._index = index;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App adopt orphan persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentAdoptOrphan._data.label },
								{ $type: "p", $text: appServicesPersistentAdoptOrphan._data.description },
								{ $type: "hr" },
								appServicesPersistentAdoptOrphan._form(),
							],

						},
					]
				}
			}
		);

	},


	_form: function () {

		var serviceConsumer = this._data.adoptable[ this._index ];

		var publisherNamespace = this._data.publisher_namespace;
		var typePath = this._data.type_path;
		var parent = serviceConsumer.parent;
		var serviceHandle = serviceConsumer.service_handle;

		var params = this._data.params.filter( function( param ) {
			return param.immutable != true;
		} ).map( function( param ) {
			param.value = serviceConsumer.variables[ param.name ];
			return param;
		} );

		return form ( {
			components: [
				{ $type: "strong", $text: "Adopt " + ( serviceConsumer.parent == serviceConsumer.service_handle ? serviceConsumer.parent : serviceConsumer.parent + " - " + serviceConsumer.service_handle ) },
				{ $type: "hr" },
				{
					$components: params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentAdoptOrphan._appName ); } } ),
				formSubmit( params.length > 0 ? {} : { init: function(button) { button.click(); } } ),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/adopt_orphan",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				parent: parent,
				service_handle: serviceHandle
			},
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentAdoptOrphan._appName );
				},
			}
		});
	}

};

var $appServicesPersistentCreateNew = {

	$cell: true,
	id: "appServicesPersistentCreateNew",

	_appName: null,
	_data: null,


	_live: function( appName, data ) {

		this._appName = appName;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-plus",
					text: "App create new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentCreateNew._data.label },
								{ $type: "p", $text: appServicesPersistentCreateNew._data.description },
								{ $type: "hr" },
								{
									id: "appServicesPersistentCreateNewContent",
									_data: null,

									$components: [
										icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
									],

									$init: appServicesPersistentCreateNew._load(),

									_refresh: function (data) {
										this._data = data
									},

									$update: function () {
										this.$components = [
											appServicesPersistentCreateNew._form(),
										];
									},

								},

							],

						},
					]
				}
			}
		);

	},


	_load: function () {

		var params = appServicesPersistentCreateNew._data.params;
		var strings = params.map( function( param ) {
			return ( param.value || '' );
		});

		apiRequest({
			action: "/apps/" + this._appName + "/resolve_strings",
			params: { strings: strings },
			callbacks: {
				200: function(response) {
					resolvedData = params.map( function( param, i ) {
						param.value = response[i];
						return param;
					} );
					appServicesPersistentCreateNewContent._refresh( resolvedData );
				}
			}
		});

	},


	_form: function () {

		var params = appServicesPersistentCreateNewContent._data;

		return form ( {
			components: [
				formField( {
					name: "publisher_namespace",
					type: "hidden",
					value: appServicesPersistentCreateNew._data.publisher_namespace
				} ),
				formField( {
					name: "type_path",
					type: "hidden",
					value: appServicesPersistentCreateNew._data.type_path
				} ),
				{
					$components: params.map( function( field ) {
						field.name_prefix = "data[variables]";
						return enginesField( field );
					} )
				},
				formCancel ( { onclick: () => { appServicesNew._live( appServicesPersistentCreateNew._appName ); } } ),
				formSubmit( params.length > 0 ? {} : { init: function(button) { button.click(); } } ),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/create_new",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentCreateNew._appName );
				},
			}
		});
	}

};

var $appServicesPersistentImport = {

	$cell: true,
	id: "appServicesPersistentImport",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
    this._data = data;
		this._show();

	},

  _show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-upload",
					text: "App persistent service import data",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							$components: [
								{ $type: "h4", $text: appServicesPersistentImport._data.label },
								{ $type: "p", $text: appServicesPersistentImport._data.description },
								{ $type: "hr" },
								{
									$components: [
                    appServicesPersistentImport._form()
									],
								},

							],

						},
					]
				}
			}
		);

  },


	_form: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		return form ( {
			components: [
				formField( {
					name: "data[file]",
          label: false,
					type: "file",
					required: true,
				} ),
				formField({
					name: "data[write]",
					label: false,
					type: "radio_buttons",
					required: true,
					collection: {
						overwrite: "Overwrite",
						replace: "Replace"
					}
				}),
				formCancel ( { onclick: () => { appServicesPersistent._live(
					appServicesPersistentImport._appName,
					appServicesPersistentImport._publisherNamespace,
					appServicesPersistentImport._typePath,
					appServicesPersistentImport._serviceHandle );
				} } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/import/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
      enctype: "multipart/form-data",
			method: 'POST',
			callbacks: {
				200: function() {
					appServices._live( appServicesPersistentImport._appName );
				},
			}
		});
	}

};

var $appServicesNonpersistent = {

	$cell: true,
	id: "appServicesNonpersistent",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App non-persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appServicesNonpersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: appServicesNonpersistent._load(),

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								var immutableParams = this._data.params.filter( function(param) { return param.immutable } );
								var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									button( {
										icon: "fa fa-tag",
										text: "Registration",
										// wrapperClass: "clearfix",
										// class: "pull-right",
										onclick: function () { appServicesNonpersistentRegistration._live(
											appServicesNonpersistent._appName,
											appServicesNonpersistent._publisherNamespace,
											appServicesNonpersistent._typePath,
											appServicesNonpersistent._serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									{ $type: "label", $text: "Immutable" },
									dataList( { class: "dl-horizontal", items: ( immutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) ) } ),
									{ $type: "label", $text: "Mutable" },
									dataList( { class: "dl-horizontal", items: ( mutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) ) } ),
									button( {
										icon: "fa fa-edit",
										wrapperClass: "clearfix",
										class: "pull-right-md",
										text: "Edit",
										onclick: () => { appServicesNonpersistentEdit._live(
											appServicesNonpersistent._appName,
											appServicesNonpersistent._publisherNamespace,
											appServicesNonpersistent._typePath,
											appServicesNonpersistent._serviceHandle,
											this._data ); },
									} ),
									{ $type: "hr" },
									button( {
										icon: "fa fa-trash",
										wrapperClass: "clearfix",
										text: "Delete",
										onclick: function () {
											if( confirm("Are you sure that you want to delete this non-persistent service?") ) {
												appServicesNonpersistent._delete();
											};
										}
									} ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					appServicesNonpersistentContent._refresh( response );
				}
			}
		});

	},


	_delete: function( method ) {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			method: "DELETE",
			action: "/apps/" + appName + "/service_manager/nonpersistent/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					appServices._live( appName );
				},
			},
		});

	},

};

var $appServicesNew = {

	$cell: true,
	id: "appServicesNew",

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
					icon: "fa fa-plus",
					text: "App new service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appServicesNewContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "label", $text: "Persistent" },
									appServicesNew._services( "persistent" ),
									{ $type: "hr" },
									{ $type: "label", $text: "Non-persistent" },
									appServicesNew._services( "non_persistent" ),
									// pp( this._data )

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

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/available",
			callbacks: {
				200: function(response) {
					appServicesNewContent._refresh( response );
				}
			}
		});

	},


	_services: function ( type ) {
		return {
			$components: appServicesNewContent._data[ type ].map( function( service ) {
				return button( {
					text: service.label,
					onclick: function () {
						if ( type == "persistent") {
							appServicesPersistentNewType._live(
								appServicesNew._appName,
								service.publisher_namespace,
								service.type_path );
						} else {
							appServicesNonpersistentNew._live(
								appServicesNew._appName,
								service.publisher_namespace,
								service.type_path );
						}
					}
				} );
			} )
		};
	}

};

var $appServicesPersistent = {

	$cell: true,
	id: "appServicesPersistent",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-compass",
					text: "App persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appServicesPersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: appServicesPersistent._load,

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {

								var appName = appServicesPersistent._appName;
								var publisherNamespace = appServicesPersistent._publisherNamespace;
								var typePath = appServicesPersistent._typePath;
								var serviceHandle = appServicesPersistent._serviceHandle;

								var immutableParams = this._data.params.filter( function(param) { return param.immutable } );
								var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );

								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									{
										class: "clearfix",
										$components: [
											button( {
												icon: "fa fa-download",
												class: "pull-left-md",
												text: "Export",
												onclick: appServicesPersistent._export
											} ),
											button( {
												icon: "fa fa-upload",
												class: "pull-right-md",
												text: "Import",
												onclick: () => { appServicesPersistentImport._live(
													appName,
													publisherNamespace,
													typePath,
													serviceHandle,
													this._data ); }
											} ),
										]
									},
									{ $type: "hr" },
									{ $type: "label", $text: "Immutable" },
									dataList( { class: "dl-horizontal", items: immutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),
									{ $type: "label", $text: "Mutable" },
									dataList( { class: "dl-horizontal", items: mutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),
									button( {
										icon: "fa fa-edit",
										wrapperClass: "clearfix",
										class: "pull-right-md",
										text: "Edit",
										onclick: () => { appServicesPersistentEdit._live(
											appName,
											publisherNamespace,
											typePath,
											serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									button( {
										icon: "fa fa-trash",
										class: "pull-left-md",
										text: "Delete",
										onclick: function() { appServicesPersistentDelete._live(
											appName,
											publisherNamespace,
											typePath,
											serviceHandle
										) },
									} ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					appServicesPersistentContent._refresh( response );
				}
			}
		});

	},

	_export: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/persistent/export",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
		});

	},

};

var $appEnvironmentVariablesApplication = {

	$cell: true,
	id: "appEnvironmentVariablesApplication",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Environment variables for application" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesApplication._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesApplicationContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									form( {
										components: [
											{
												$components: data.blueprint_environment_variables.map( function( field ) {

													field.value = data.variables.find( function( variable ) { return variable.name == field.name } ).value;
													field.name_prefix = "data";
													return enginesField( field );
												} )
											},
											formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesApplication._appName ); } } ),
											formSubmit(),
										] ,
										action: "/apps/" + this._appName + "/environment_variables",
										method: "PATCH",
										callbacks: {
											200: function(response) {
												appEnvironmentVariables._live( appEnvironmentVariablesUser._appName );
											},
										}
									} ),
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
		apiRequest({
			action: "/apps/" + this._appName + "/environment_variables",
			callbacks: {
				200: function(response) {
					appEnvironmentVariablesApplicationContent._refresh( response.application );
				},
			}
		});
	},


	_form: function ( data ) {
		components = [];
		for ( var variable in data.software_environment_variables ) {

		};

		return form ( {
			components: [
				formField( {
					name: "data[default_site]",
					label: "Default site",
					hint: "Enter a host name (e.g: www.engines.org )",
					value: data.default_site
				} ),
				formCancel ( { onclick: systemControlPanel._live } ),
				formSubmit(),
			],
			action: "/system/default_site",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});

	},


};

var $appEnvironmentVariablesUserEdit = {

	$cell: true,
	id: "appEnvironmentVariablesUserEdit",

	_appName: null,


	_live: function( appName ) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Edit user environment variables" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesUserEdit._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesUserEditContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									form( {
										components: [
											{
												$components: data.map( function( environment_variable ) {
													return formField( {
														name: "data[" + environment_variable.name + "]",
														label: environment_variable.label,
														value: environment_variable.value
													} );
												} )
											},
											formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesUserEdit._appName ); } } ),
											formSubmit(),
										] ,
										action: "/apps/" + this._appName + "/environment_variables",
										method: "PATCH",
										callbacks: {
											200: function(response) {
												appEnvironmentVariables._live( appEnvironmentVariablesUserEdit._appName );
											},
										}
									} ),
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
		apiRequest({
			action: "/apps/" + this._appName + "/environment_variables",
			callbacks: {
				200: function(response) {
					appEnvironmentVariablesUserEditContent._refresh( response.user );
				},
			}
		});
	},

};

var $appEnvironmentVariablesUserNew = {

	$cell: true,
	id: "appEnvironmentVariablesUserNew",

	_appName: null,


	_live: function( appName ) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "New user environment variable" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appEnvironmentVariablesUserNew._appName },
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesUserNewContent",
							$components: [
								form( {
									components: [
										formField( {
											name: "data[name]",
											label: "Name"
										} ),
										formField( {
											name: "data[value]",
											label: "Value"
										} ),
										formCancel ( { onclick: function () { appEnvironmentVariables._live( appEnvironmentVariablesUserNew._appName ); } } ),
										formSubmit(),
									] ,
									action: "/apps/" + this._appName + "/environment_variables",
									method: "POST",
									callbacks: {
										200: function(response) {
											appEnvironmentVariables._live( appEnvironmentVariablesUserNew._appName );
										},
									}
								} ),
							],

						}
					]
				}
			}
		);
	},

};

var $appEnvironmentVariables = {

	$cell: true,
	id: "appEnvironmentVariables",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "App environment variables" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appEnvironmentVariables._appName ); }
								} ),
								{ $type: "h4", $text: appEnvironmentVariables._appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									appEnvironmentVariables._applicationEnvironmentVariables( data ),
									appEnvironmentVariables._userEnvironmentVariables( data ),
									appEnvironmentVariables._systemEnvironmentVariables( data ),
									appEnvironmentVariables._serviceConsumerEnvironmentVariables( data ),
								];
							},

						}
					]
				}
			}
		);
		this._load();
	},

	_applicationEnvironmentVariables: function( data ) {
		var disableEdit = data.application.variables.every( function ( variable ) {
			return variable.immutable;
		});
		return data.application.variables.length ? {
			$components: [
				{ $type: "label", $text: "Application" },
				{
					class: "clearfix",
					$components: [
						dataList( { class: "dl-horizontal", items: data.application.variables.map( function ( variable ) {
							return { label: ( variable.input || {} ).label || variable.name, data: variable.value };
						} ) } ),
						button( {
							icon: "fa fa-edit",
							text: "Edit",
							class: "pull-right",
							disabled: disableEdit,
							onclick: () => { appEnvironmentVariablesApplication._live( appEnvironmentVariables._appName ) }
						} ),
					]
				},
				{ $type: "hr" },
			]
		} : {};
	},


	_userEnvironmentVariables: function( data ) {
		return {
			$components: [
				{ $type: "label", $text: "User" },
				{
					class: "clearfix",
					$components: [
						dataList( { class: "dl-horizontal", items: data.user.map( function ( variable ) {
							return { label: ( variable.input || {} ).label || variable.name, data: variable.value };
						} ) } ),
						button( {
							icon: "fa fa-plus",
							text: "New",
							class: "pull-left",
							onclick: () => { appEnvironmentVariablesUserNew._live( appEnvironmentVariables._appName ) }
						} ),
						button( {
							icon: "fa fa-edit",
							text: "Edit",
							class: "pull-right",
							disabled: data.user.length == 0,
							onclick: () => { appEnvironmentVariablesUserEdit._live( appEnvironmentVariables._appName ) }
						} ),
					]
				},
				{ $type: "hr" },
			]
		};
	},


	_systemEnvironmentVariables: function( data ) {
		return data.system.length ? {
			$components: [
				{ $type: "label", $text: "System" },
				dataList( { class: "dl-horizontal", items: data.system.map( function ( variable ) {
					return { label: variable.label || variable.name, data: variable.value };
				} ) } ),
				{ $type: "hr" },
			]
		} : {};
	},


	_serviceConsumerEnvironmentVariables: function( data ) {
		var components = [];
		for ( var ownerGroup in data.service_consumers ) {
			components.push( { $type: "label", $text: data.service_consumers[ownerGroup].label } );
			components.push( {
				$components: [
					dataList( { class: "dl-horizontal", items: data.service_consumers[ownerGroup].variables.map( function ( variable ) {
						return { label: ( variable.input || {} ).label || variable.label || variable.name, data: variable.value }; // variable.label to support legacy service definition
					} ) } ),
				]
			} );
			components.push( { $type: "hr" } );
		};
		components.pop(); // remove last hr
		return {
			$components: components
		};
	},


	_load: function () {
		apiRequest({
			action: "/apps/" + this._appName + "/environment_variables",
			callbacks: {
				200: function(response) {
					appEnvironmentVariablesContent._refresh(response);
				},
			}
		});
	},

};

var $installFromLibrary = {

	$cell: true,
	id: "installFromLibrary",


	_live: function () {
		modal._live ( {
			dialogClass: "modal-lg",
			header: icon({icon: "fa fa-plus", text: "Install app"}),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemMenu._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} )
						]
					},
					{
						class: "row",
						style: "text-align: center;",
						$components: [
							{ id: "installFromLibraryAppList",
							 	$components: [
									icon({icon: "fa fa-spinner fa-spin", text: "Loading" })
								]
							}
						]
					}
				]
			}
		});
		this._loadApps();

	},


	_loadApps: function() {

		apiRequest({
			action: '/library/0',
			callbacks: {
				200: function(response) {
					installFromLibrary._renderApps ( response.apps );
				},
				405: function (response) {
					alert( response.error.message );
					systemMenu._live();
				}
			}
		});

	},


	_renderApps: function(appsData) {

		installFromLibraryAppList.$components = [
			{
				$type: "input",
				class: "search form-control",
				$init: function() {
					new List('installFromLibraryAppList', { valueNames: ['searchListItem'] });
				},
				placeholder: "Search",
				style: "width: 200px; margin-bottom: 10px; display: inline-block;",
			},
			{
				$type: "ul",
				class: "list",
				style: "list-style: none; margin-left: -30px;",
				$components: appsData.map(
					function (appData) {
						return {
							$type: "li",
							class: "col-xs-6 col-sm-3 col-md-2 col-lg-2",
							$components: [
								{
									$type: "button",
									style: "height: 128px; width: 100%; overflow: hidden; text-align: center; padding: 5px; white-space: normal; background-color: transparent; line-height: 128px;",
									class: "btn",
									title: "Install " + appData.label,
									$components: [
										{
											style: "height: 128px; line-height: 64px",
											$components: [
												{
													style: "height: 64px; width: 64px; display: inline-block; padding-bottom: 6px;",
													$components: [
														{
															$type: "img",
															src: appData.icon_url,
															style: "max-height: 64px; max-width: 64px;"
														}
													]
												},
												{
													style: "line-height: 1; padding-top: 5px;",
													$components: [
														{ $type: "span", class: "searchListItem", $text: appData.label }
													]
												}
											]
										}
									],
									onclick: function () {
										installNewApp._live( appData, function () { installFromLibrary._live() } )
									}
								}
							]
						};
					}
				)
			},
		];
		$("#modal input.search").focus();

	},

};

var $installBuild = {

	$cell: true,
	id: "installBuild",

	_builderLogEventSource: null,
	_appName: null,

	_live: function () {

		this._appName = system._$data.builder.current.engine_name;

		modal._live ( {
			dialogClass: "modal-lg",
			header: icon({icon: "fa fa-plus", text: "Building app"}),
			body: {
				$components: [
					{ $type: "h4", $text: installBuild._appName },
					progressBar( { id: "installBuildProgress" } ),
					{
						id: "installBuildComplete",
						style: "display: none;",
						$components: [
							{
								id: "installBuildCompleteBuildReport",
								$components: [
									{ $type: "hr" },
									{ $type: "p", $text: "Build complete. Please review the build report and follow its instructions." },
									button( {
										icon: "fa fa-list-ol",
										text: "Build report",
										onclick: function () { appBuildReport._live( installBuild._appName ); },
									} ),
								],
							},
							{ $type: "hr" }
						]
					},
					{
						id: "installBuildFailed",
						style: "display: none;",
						class: "clearfix",
						$components: [
							{
								class: "clearfix",
								$components: [
									{ $type: "p", $text: "Build failed.", class: "pull-left" },
									button( { icon: "fa fa-times", text: "Close", onclick: modal._kill, wrapperClass: "pull-right" } ),
								]
							},
							{ $type: "hr" }
						]
					},
					{
						id: "installBuildLogHidden",
						$components: [
							{
								class: "clearfix",
								$components: [
									button( {
										wrapperClass: "pull-right",
										icon: "fa fa-file-text-o",
										text: "Show log",
										onclick: function () {
											$("#installBuildLogHidden").hide();
											$("#installBuildLogShown").slideDown('fast');
										}
									} )
								]
							}
						]
					},
					{
						id: "installBuildLogShown",
						style: "display: none;",
						$components: [
							{
								class: "clearfix",
								$components: [
									button( {
										wrapperClass: "pull-right",
										icon: "fa fa-file-text-o",
										text: "Hide log",
										onclick: function () {
											$("#installBuildLogShown").hide();
											$("#installBuildLogHidden").show();
										}
									} ),
								]
							},
							{
								$type: "pre",
								id: "installBuildLog",
								$init: function () {
									installBuild._streamLog();
								},
							}
						]
					},
				]
			}
		});

	},


	_streamLog: function() {

		if ( this._builderLogEventSource ) { this._builderLogEventSource.close() };
		this._builderLogEventSource = new EventSource( '/system/builder_log_events' );
		this._builderLogEventSource.onmessage = function(e) {
			response = JSON.parse(e.data);
			if ( response.type == "line" ) {
				var line = response.line;
				this._incrementProgress( line );
				if ( !( line == "." && $("#installBuildLog").text()[0] == "." ) ) { line = line + "\n" }
				$("#installBuildLog").prepend( line );
			} else if ( response.type == "eof" ) {
				this._builderLogEventSource.close();
				this._builderLogEventSource = null;
				this._checkBuild();
			};
		}.bind( this );

	},


	_checkBuild: function () {

		apiRequest( {
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response);
					if ( response.builder.status.is_building ) {
						installBuild._live();
					} else if ( response.builder.status.did_build_fail ) {
						installBuild._showFailed();
					} else {
						installBuild._showComplete();
					};
				}
			}
		} );

	},

	_showComplete: function () {
		$("#installBuildProgress").hide();
		$("#installBuildComplete").show();
	},

	_showFailed: function () {
		$("#installBuildProgress").hide();
		$("#installBuildFailed").show();
	},

	_incrementProgress: function ( line ) {
		if ( line == "Build Finished" ) {
			installBuildProgress._setWidth(1);
		} else if ( line == "Waiting for start" ) {
			installBuildProgress._setWidth(0.95);
		} else if ( line.match(/^Step \d+\/\d+/) ) {
			var step = line.substring(5).split(" : ")[0].split("/");
			installBuildProgress._setWidth( 0.1 + 0.8 * step[0] / step[1] );
		} else {
			installBuildProgress._showMinorProgress();
		};

	}

};

var $installNewApp = {

	$cell: true,
	id: "installNewApp",

	_blueprintUrl: null,
	_data: null,

	_live: function( appData, cancelFunc ) {

		this._blueprintUrl = appData.blueprint_url;
		this._iconUrl = appData.icon_url;
		this._cancelFunc = cancelFunc
		this._show();

	},

	_show: function () {

		modal._live ( {
			header: icon ( { icon: "fa fa-plus", text: "Install app" } ),
			body: {
				id: "installNewAppForm",
				$components: [
						icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
				]
			}
		} );
		this._load();

	},


	_load: function() {

		var blueprintUrl = this._blueprintUrl

		apiRequest({
			action: '/system/install',
			params: { blueprint_url: blueprintUrl },
			callbacks: {
				200: function(response) {
					installNewApp._data = response
					installNewApp._renderForm();
				},
				405: function (response) {
					alert( response.error.message );
					installNewApp._cancelFunc();
				}
			}
		});

	},


	_renderForm: function () {

		installNewAppForm.$components = [
			installNewApp._form(),
		];

	},

	_form: function () {

		var blueprint = this._data.blueprint;
		var name = this._availableEngineNameFor(blueprint.software.base.name);
		var heading = dig ( blueprint, "metadata", "software", "display", "label" ) ||
									dig (	blueprint, "metadata", "software", "display", "title" ) ||
									name;
		var comment = dig ( blueprint, "software", "base", "install_form_comment" );
		var blueprintUrl = this._blueprintUrl;
		var iconUrl = this._iconUrl;
		var requiredMemory = dig ( blueprint, "software", "base", "memory", "required" ) || 0;
		var recommendedMemory = dig ( blueprint, "software", "base", "memory", "recommended" ) || 0;
		var country = this._data.locale.country_code;
		var language = this._data.locale.lang_code;
		var defaultHttpProtocol = dig ( blueprint, "software", "base", "http_protocol" );
		var defaultDomain = this._data.default_domain;
		var domains = this._data.domains;
		var environmentVariables = blueprint.software.environment_variables || [];
		var serviceConfigurations = blueprint.software.service_configurations || [];

		var licenseLabel = dig ( blueprint, "metadata", "software", "license", "label" );
		var licenseUrl = dig ( blueprint, "metadata", "software", "license", "url" );

		return form ( {
			components: [
				{ $type: "h4", $text: heading },
				comment ? { $components: [ markdown( comment ), { $type: "hr" } ] } : {},
				{
					class: "clearfix",
					$components: [
						button( {
							class: "installNewAppFormCustomCollapse",
							wrapperClass: "pull-right",
							icon: "fa fa-edit",
							text: "Custom",
							onclick: function () {
								$(".installNewAppFormCustomCollapse").toggle();
							}
						} ),
					]
				},
				{
					style: "display: none;",
					class: "installNewAppFormCustomCollapse",
					$components: [
						formField({ type: "hidden", name: "data[blueprint_url]", value: blueprintUrl }),
						formField({ type: "hidden", name: "data[icon_url]", value: iconUrl }),
						formField( {
							name: "data[engine_name]",
							id: "installNewAppFormField_container_name",
							label: "Name",
							value: name,
							onchange: function( e ) {
								installNewApp._checkContainerNameReserved();
							},
						} ),
						formField( {
							type: "number",
							name: "data[memory]",
							id: "installNewAppFormField_memory",
							label: "Memory MB",
							min: requiredMemory,
							value: recommendedMemory,
							hint: "Required " + requiredMemory + "MB. Recommended " + recommendedMemory + "MB."
						} ),
						legend ( { text: "Locale" } ),
						formField( {
							type: "country",
							name: "data[country_code]",
							id: "installNewAppFormField_country",
							label: "Country",
							value: country
						} ),
						formField( {
							type: "language",
							name: "data[language_code]",
							id: "installNewAppFormField_language",
							label: "Language",
							value: language
						} ),
						legend ( { text: "Network" } ),
						formField( {
							type: "select",
							name: "data[http_protocol]",
							id: "installNewAppFormField_http_protocol",
							label: "HTTP Protocol",
							collection: availableHttpProtocols( defaultHttpProtocol ),
							value: defaultHttpProtocol
						}),
						formField( {
							name: "data[host_name]",
							id: "installNewAppFormField_host_name",
							label: "Host name",
							value: name.replace('_','-'),
							onchange: function( e ) {
								installNewApp._checkFqdnReserved();
							},
						}),
						formField( {
							type: "select",
							name: "data[domain_name]",
							id: "installNewAppFormField_domain_name",
							label: "Domain name",
							value: defaultDomain,
							collection: domains,
							onchange: function( e ) {
								installNewApp._checkFqdnReserved();
							},
						} ),
						serviceConfigurations.length ? legend ( { text: "Services" } ) : {},
						{ $components: serviceConfigurations.map(
							function (obj, i) {
								return installNewApp._formServiceConfigurationFields (obj, i);
							}
						) },
						environmentVariables.length ? legend ( { text: "Environment variables" } ) : {},
					]
				},
				{
					$components: environmentVariables.map(
						function (obj, i) {
							return installNewApp._formEnvironmentVariableField (obj, i)
						}
					)
				},
				legend ( { text: "License" } ),
				licenseUrl ?
					{
						$components: [
							{
								$components: [
									{
										$type: "a",
										$text: ( licenseLabel || "Read the license" ),
										title: "Read the license",
										onclick: () => {
											openUrl( licenseUrl );
										}
									},
									formField( {
										type: "checkbox",
										label: "I have read and accept the license.",
										title: "Accept the license",
										name: "data[license_accepted]",
										required: true
									}	)
								]
							},
						]
					}
				: { $type: "p", $text: "No license." },
				formCancel ( { onclick: installNewApp._cancelFunc } ),
				formSubmit( { onclick: installNewApp._checkFqdnReserved }),
			],
			action: "/system/install",
			callbacks: {
				200: function() {
					system._live();
				},
			}
		});

	},


	_availableEngineNameFor: function (base_name) {

		var reserved_names = this._data.reserved.container_names;
		var name = base_name.substring ( 0, 16 )
		var index = 2
		while ($.inArray ( name, reserved_names ) > -1) {
			max_name_length = 16 - index.toString().length;
			name = base_name.substring ( 0, max_name_length ) + index.toString();
			index ++
		};
		return name;

	},

	_checkFqdnReserved: function () {
		var fqdn = $("#installNewAppFormField_host_name").val() + '.' + $("#installNewAppFormField_domain_name").val();
		if( $.inArray( fqdn, installNewApp._data.reserved.fqdns ) > -1 ) {
			if ( !$("#installNewAppFormField_host_name").is(':visible') ) {
				$(".installNewAppFormCustomCollapse").toggle();
			};
			$("#installNewAppFormField_host_name")[0].setCustomValidity(
				fqdn + " is already in use."
			);
			return true;
		} else {
			$("#installNewAppFormField_host_name")[0].setCustomValidity('')
			return true;
		};
	},


	_checkContainerNameReserved: function () {
		var name = $("#installNewAppFormField_container_name").val();
		if( $.inArray( name, installNewApp._data.reserved.container_names ) > -1 ) {

			if ( !$("#installNewAppFormField_container_name").is(':visible') ) {
				$(".installNewAppFormCustomCollapse").toggle();
			};

			$("#installNewAppFormField_container_name")[0].setCustomValidity(
				name + " is already in use."
			);
		} else {
			$("#installNewAppFormField_container_name")[0].setCustomValidity('')
		};
	},


	_formEnvironmentVariableField: function (field, i) {
		if ( field.ask_at_build_time != true ) {
			return {};
		} else {
			field.id = "installNewAppFormFieldEnvironmentVariable_" + i;
			field.name_prefix = "data[environment_variables]";
			return {
				class: ( field.mandatory == true ? "" : "collapse installNewAppFormCustomCollapse" ),
				$components: [
					enginesField(field)
				]
			};
		};

	},


	_formServiceConfigurationFields: function (obj, i) {

		var consumableService = this._data.consumable_services.find(
			function (consumable_service) {
				return ( consumable_service.service_definition.publisher_namespace == obj.publisher_namespace &&
				consumable_service.service_definition.type_path == obj.type_path );
			}
		);

		var selectOptions = serviceConsumerCreateType( consumableService );

		return {
			id: "installNewAppFormFieldServiceConfiguration_" + i,
			$components: [
				formField({ type: "hidden", name: "data[services][][publisher_namespace]", value: consumableService.service_definition.publisher_namespace }),
				formField({ type: "hidden", name: "data[services][][type_path]", value: consumableService.service_definition.type_path }),
				formField( {
					type: "select",
					label: consumableService.service_definition.title || ( consumableService.service_definition.publisher_namespace + '/' + consumableService.service_definition.type_path ),
					collection: selectOptions,
					id: "installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
					name: "data[services][][create_type]"
				} ),
				( consumableService.shareable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						name: "data[services][][share]",
						collection: installNewApp._formServiceConfigurationShareableServiceOptions(consumableService),
						dependOn: {
							input: "installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
							value: "share"
						}
					})
				 ),
				( consumableService.adoptable.length == 0 ? {} :
					formField( {
						type: "select",
						label: false,
						name: "data[services][][adopt]",
						collection: installNewApp._formServiceConfigurationAdoptableServiceOptions(consumableService),
						dependOn: {
							input: "installNewAppFormFieldServiceConfiguration_" + i + "_create_type",
							value: "adopt"
						}
					})
				 ),
			],
		};

	},


	_formServiceConfigurationShareableServiceOptions: function( consumableService ) {

		return consumableService.shareable.map(
			function( availableService ) {
				return this._formAvailableServiceOption( availableService );
			}.bind(this)
		);

	},


	_formServiceConfigurationAdoptableServiceOptions: function (consumableService) {

		return consumableService.adoptable.map(
			function(availableService) {
				return this._formAvailableServiceOption (availableService)
			}.bind(this)
		);

	},


	_formAvailableServiceOption: function( availableService ) {
		var parent = availableService.parent;
		var serviceHandle = availableService.service_handle;
		var optionValue = parent + "#" + serviceHandle;
		var optionLabel = ( parent + ( parent == serviceHandle ? "" : " - " + serviceHandle ) );
		return [ optionValue, optionLabel ];
	}

};

var $installSideLoad = {

	$cell: true,
	id: "installSideLoad",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-caret-square-o-right", text: "Side load" } ),
				body: {
					$components: [
						form( {
							components: [
								formField( {
									name: "blueprint_url",
									id: "installSideLoadField_blueprint_url",
									type: "url",
									label: "Blueprint URL",
									required: true
								} ),
								formField( {
									name: "icon_url",
									id: "installSideLoadField_icon_url",
									type: "url",
									label: "Icon URL",
									required: false
								} ),
								formCancel ( { onclick: systemControlPanel._live } ),
								formSubmit()
							],
							init: function ( form ) {
								$(form).submit( function( e ) {
									installNewApp._live(
										{
											blueprint_url: $("#installSideLoadField_blueprint_url").val(),
											icon_url: $("#installSideLoadField_icon_url").val()
										},
										function() {
											installSideLoad._live();
										}
									);
									e.preventDefault();
								} );
							}
						} ),
					],
				}
			}
		);
	},

};

function renderSystemService( service, memory ) {

	var title = service.name + ( system._$showContainerMemoryUsage ?
	(
		"\n\nMemory usage" +
		(
			memory ?
			"\nCurrent " + (memory.current/1024/1024).toFixed(1) +
			" MB\nPeak " + (memory.maximum/1024/1024).toFixed(1) +
			" MB\nAllocated " + (memory.limit/1024/1024).toFixed(0) + " MB"
			: "\nnone"
		)
	)	: "" );

	return {
		class: "engines_container",
		$components: [
			{
				$type: "button",
				class: "btn btn-lg btn-custom",
				style: "width: 100%;",
				title: title,
				$components: [
					{
						$components: [
							containerStateIcon(service.state),
							{
								$type: "span",
								$text: service.name
							},
							( service.had_oom || service.restart_required ) ? {
								$type: "span",
								$components: [
									{ $type: "span", $html: "&nbsp;" },
									icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
								]
							} : {},
						]
					},
					system._$showSoftwareTitles ? {
						style: "width: 100%; height: 24px; margin-top: -5px; overflow-x: hidden;",
						$components: [
							{
								id: "systemServiceTitle" + service.name,
								$type: "small",
								style: "color: #333;",
								$text: systemServices._titleFor(service.name),
								_refresh: function( serviceTitle ) {
									this.$text = serviceTitle;
								}
							},
						],
					} : {},
					system._$showContainerMemoryUsage ?
					{
						$type: "p",
						style: "border-radius: 5px !important; min-height: 10px; box-shadow: 0px 0px 5px 0px #eee inset;",
						title: title,
						$components: [
							( memory && memory.current ) ?
							{
								style: "line-height: 0px; position: relative;",
								$components: [
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.current/memory.limit > 0.9 ? "#F00c" : "#48dc") + "; box-shadow: 0px 0px 10px 0px #999 inset; display: inline-block; height: 10px; width: " + memory.current / memory.limit * 100 + "%; min-width: 10px;",
									},
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.maximum/memory.limit > 0.9 ? "#F003" : "#48d3") + "; display: inline-block; height: 10px; width: " + memory.maximum / memory.limit * 100 + "%; min-width: 10px;",
									}
								]
							} : {}
						],
					} : {},
				],
				onclick: function () { serviceMenu._live( service.name ) }
			},
		],

	};

};

function renderSystemApp( app, memory ) {

	var title = app.name + ( system._$showContainerMemoryUsage ?
	(
		"\n\nMemory usage" +
		(
			memory ?
			"\nCurrent " + (memory.current/1024/1024).toFixed(1) +
			" MB\nPeak " + (memory.maximum/1024/1024).toFixed(1) +
			" MB\nAllocated " + (memory.limit/1024/1024).toFixed(0) + " MB"
			: "\nnone"
		)
	)	: "" );

	return {
		class: "engines_container",
		$components: [
			{
				$type: "button",
				class: "btn btn-lg btn-custom",
				style: "width: 100%;",
				title: title,
				$components: [
					{
						$components: [
							containerStateIcon(app.state),
							{
								$type: "span",
								$text: app.name
							},
							( app.had_oom || app.restart_required ) ? {
								$type: "span",
								$components: [
									{ $type: "span", $html: "&nbsp;" },
									icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
								]
							} : {},
						]
					},
					system._$showSoftwareTitles ? {
						style: "width: 100%; height: 24px; margin-top: -5px; overflow-x: hidden;",
						$components: [
							{
								id: "systemAppTitle" + app.name,
								$type: "small",
								style: "color: #333;",
								$text: systemApps._titleFor(app.name),
								_refresh: function( appTitle ) {
									this.$text = appTitle;
								}
							},
						],
					} : {},
					system._$showContainerMemoryUsage ?
					{
						$type: "p",
						style: "border-radius: 5px !important; min-height: 10px; box-shadow: 0px 0px 5px 0px #eee inset;",
						title: title,
						$components: [
							( memory && memory.current ) ?
							{
								style: "line-height: 0px; position: relative;",
								$components: [
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.current/memory.limit > 0.9 ? "#F00c" : "#48dc") + "; box-shadow: 0px 0px 10px 0px #999 inset; display: inline-block; height: 10px; width: " + memory.current / memory.limit * 100 + "%; min-width: 10px;",
									},
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.maximum/memory.limit > 0.9 ? "#F003" : "#48d3") + "; display: inline-block; height: 10px; width: " + memory.maximum / memory.limit * 100 + "%; min-width: 10px;",
									}
								]
							} : {}
						],
					} : {},
				],
				onclick: function () { appMenu._live( app.name ) }
			},
		],

	};

};

function renderSystemApps() {

  return {
    id: "systemApps",
    _$data: null,
    _$memoryData: {},
    $titleData: {},

    $init: function() {
      this._load();
    },

    _load: function() {
  		apiRequest({
  			action: 'system/containers/apps',
        callbacks: {
          200: function(data) {
            systemApps._refresh(data);
          },
        },
      });
    },

    _refresh: function(data) {
      this._$data = data;
    },

    _refreshMemory: function( data ) {
      this._$memoryData = data;
    },

    _handleEvent: function( event ) {
      ( this._$data || [] ).map(
        function( app ) {
          if ( app.name == event.container_name ) {
            return $.extend( app, event.status );
          } else {
            return app;
          };
        }
      );
    },

    $update: function() {

      var memoryData = this._$memoryData || {};

      this.$components = [
        this._$data ?
        this._$data.length ?
        {
        	class: "system-containers",
        	$components: this._$data.map( function(app) {
            var appMemory = memoryData[app.name] || null;
        		return renderSystemApp(app, appMemory);
        	} )
        } :
        {
        	class: 'text-center',
        	$components: [
        		{ $type: 'p', $html: 'To install an app click on <span style="color: #48D"><i class="fa fa-hdd-o"></i> System</span> then <span style="color: #48D"><i class="fa fa-plus"></i> Install app</span>.' },
        	]
        } :
        {},
      ];

    },

    _dataFor: function( appName ) {
  		return this._$data.find( function( appData ) {
  			return appData.name == appName
  		} );
    },

    _titleFor: function (appName) {

  		var cachedTitle = systemApps.$titleData[appName];

      if ( typeof cachedTitle == 'undefined' ) {
        apiRequest({
  				action: "/apps/" + appName + "/about",
  				callbacks: {
  					200: function( data ) {
              var appTitle = data.software.display.label || data.software.display.title;
              window["systemAppTitle" + appName]._refresh( appTitle );
  						systemApps.$titleData[appName] = appTitle || "";
  					},
            // 401: function() {}, // remove this once api token not in file
  				}
  			});
  			return null;
  		} else {
        return cachedTitle;
  		};

  	},

  };

};

cell({

  id: "systemEvents",

  _live: function() { this._stream(); },

	_close: function () {

		if (this._eventSource) {
			this._eventSource.close();
			this._eventSource = null
		};

	},

	_isRunning: function () {
		return ( this._eventSource && ( this._eventSource.readyState != 2 ) )
	},

	_stream: function () {
		if ( !this._isRunning() ) {

			this._close();
			this._eventSource = new EventSource(
				'/system/container_events'
			);
			this._eventSource.onmessage = function(e) {
				var event = JSON.parse(e.data);
				console.log(event);
				systemEvents._handler( event );
			};
      this._eventSource.onerror = function(e) {
        setTimeout( function() { // timeout to stop warning flashup on reload
          if ( $("#systemEventsStreamingWarningMessage").length > 0 ) {
            document.querySelector("#systemEventsStreamingWarningMessage")._live();
          };
        }, 1000);
        systemEvents._close();
      };
		};
	},


	_handler: function( event ) {
		if ( event.container_type == "service" ) {
      if ( "serviceMenu" in window ) { serviceMenu._handleContainerEvent( event ) };
			if ( "systemServices" in window ) { systemServices._handleEvent( event ) };
		} else {
      if ( "appMenu" in window ) { appMenu._handleContainerEvent( event ) };
      if ( "systemApps" in window ) { systemApps._handleEvent( event ) };
		};
	},

});

cell({

  id: "systemMemory",

  _live: function() { this._polling(); },

  _polling: function () {
    this._close();
    if (system._$showContainerMemoryUsage) {
      apiRequest({
        action: '/system/statistics/container_memory',
        callbacks: {
          200: function(response) {
            if (system._$showContainerMemoryUsage) {
              systemMemory._handler(response);
              systemMemory._pollContainerMemoryTimeout = setTimeout( function() {
                systemMemory._polling();
              }, 15000)
            };
          },
        }
      });
    };
  },

  _close: function () {
    clearTimeout( systemMemory._pollContainerMemoryTimeout );
  },

  _handler: function( data ) {
    if ( "systemApps" in window ) { systemApps._refreshMemory(data.containers.applications) };
    if ( "systemServices" in window ) { systemServices._refreshMemory(data.containers.services) };
  },

});

function renderSystemServices() {

  return {
    id: "systemServices",
    _$data: [],
    _$memoryData: {},
    $titleData: {},

    $init: function() {
  		apiRequest({
  			action: 'system/containers/services',
        callbacks: {
          200: function(data) {
            systemServices._refresh(data);
          },
        },
      });
    },

    _refresh: function(data) {
      this._$data = data;
    },

    $update: function() {

      var memoryData = this._$memoryData || {};

      this.$components = [
        hr(),
        {
        	class: "system-containers",
        	$components: this._$data.map( function(service) {
            var serviceMemoryData = memoryData[service.name] || null;
        		return renderSystemService(service, serviceMemoryData);
        	} )
        },
      ];

    },

    _refreshMemory: function( data ) {
      this._$memoryData = data;
    },

    _handleEvent: function( event ) {
      ( this._$data || [] ).map(
        function( service ) {
          if ( service.name == event.container_name ) {
            return $.extend( service, event.status );
          } else {
            return service;
          };
        }
      );
    },

    _dataFor: function( serviceName ) {
  		return this._$data.find( function( serviceData ) {
  			return serviceData.name == serviceName
  		} );
    },

    _titleFor: function (serviceName) {
  		var cachedTitle = systemServices.$titleData[serviceName];

  		if ( typeof cachedTitle == 'undefined' ) {
        apiRequest({
  				action: "/services/" + serviceName + "/about",
  				callbacks: {
  					200: function( data ) {
              window["systemServiceTitle" + serviceName]._refresh( data.title );
  						systemServices.$titleData[serviceName] = data.title || "";
  					},
            // 401: function() {}, // remove this once api token not in file
  				}
  			});
  			return null;
  		} else {
        return cachedTitle;
  		};

  	},

  };

};

cell({

	id: "system",

	_$data: null,
	_$showServices: showServices,
	_$showSoftwareTitles: showSoftwareTitles,
	_$showContainerMemoryUsage: showContainerMemoryUsage,


	_live: function( onloadCallback ) {
		if ( enableEventStreaming ) { systemEvents._live() };
		this._load( onloadCallback );
	},


	_kill: function() {
		systemEvents._close();
		systemMemory._close();
		this._$data = null;
	},


	_load: function ( onupdateCallback ) {
		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response, onupdateCallback);
					$("#navbarSignOutButton").show();
					$("#pageLoadingSpinner").fadeOut();
				},
				401: function() {
					systemEvents._close();
					main._renderSignedOut();
				}
			}
		});

	},

	_refresh: function(data, onupdateCallback ) {
		this._$data = data;
		this._onupdateCallback = onupdateCallback;
		if ( this._$showContainerMemoryUsage ) {	systemMemory._live(); };
		if ( data.builder.current.engine_name ) { installBuild._live(); };
	},

	$update: function(){
		if ( this._$data ) {

			var needsAttention = 	this._$data.status.needs_reboot ||
														this._$data.status.needs_engines_update ||
														this._$data.status.needs_base_update;

			this.$components = [
				( this._$data.properties.label.text ? {
					$text: this._$data.properties.label.text,
					style: ( "color: " + this._$data.properties.label.color +
									 "; background-color: " + this._$data.properties.label.background_color +
									"; text-align: center; padding: 10px; font-size: 24px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;" )
				} : {} ),
				{
					class: "container",
					$components: [
						{
							id: "systemEventsStreamingWarningMessage",
							_live: function() {
								this.$components = [
									{
										$type: "p",
										id: 'systemEventsStreamingWarningMessage',
										class: 'text-center',
										$html: "System events steam closed. " +
											"Please <a  style='cursor: pointer;' " +
											"onclick='location.reload()'>reload</a> page.</p>",
									}
								];
							}
						},
						{
							class: "modal-content",
							style: "margin-top: 20px; margin-bottom: 100px; padding: 10px;",
							$components: [
								{
									$components: [
										{
											$type: "button",
											class: "btn btn-lg btn-custom",
											title: "System menu",
											$components: [
												icon( { icon: "fa fa-hdd-o", text: "System" } ),
												( needsAttention ?
													{
														$type: "span",
														$components: [
															{ $type: "span", $html: "&nbsp;" },
															icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
														]
													}
													: {}
												),
											],
											onclick: systemMenu._live
										},
 									]
								},
								renderSystemApps(),
								this._$showServices ? renderSystemServices() : {},
							]
						}
					]
				},
			];
			if ( this._onupdateCallback ) { this._onupdateCallback(); };
		} else {
			this.$components = [];
		};

	},

});

var $signIn = {

	$cell: true,
	id: "signIn",


	_live: function () {
		$("#pageLoadingSpinner").fadeOut();
		this.$components = [ this._form() ]
	},


	_kill: function () {
		this.$components = []
	},


	_form: function () {
		return {
			class: "text-center",

			// $init: function(){
			// 	// $("#signInPassword").blur();
			// },

			$components: [
				{ style: "display: inline-block; text-align: left; width: 80%; max-width: 300px; margin-top: 50px;",
					$components: [
						form({
							id: "signInForm",
							components: function(f) {
								return [
									remoteManagement ?
										f._field( { name: "data[system_ip]", title: "System IP address", label: false, required: true, placeholder: "IP address" } ) :
										f._field( { type: "hidden", name: "data[system_ip]", value: systemIp } ),
									f._field( { label: false, name: "data[password]", type: "site_password", required: true, placeholder: "Password", title: "System admin password" } ),
									f._submit( { title: "Sign in", text: "Sign in", icon: "fa fa-sign-in", disabledText: "Signing in" } ),
								];
							},
							action: "/system/signin",
							callbacks: {
								200: function (response) {
									main._renderSignedIn(response.system_ip);
								},
								401: function (responseJSON) {
									alert( responseJSON.error.message );
									signIn._live();
								}
							}
						}),


					]
				}
			]
		}
	},

};

var $modal = {

	$cell: true,
	id: "modal",

	$components: [
		{
			id: "modalContent",
			class: "modal"
		}
	],


	_live: function (obj) {

		$(".modal").attr("class","modal " + ( obj.class || "" ) );
		$(".modal").modal({backdrop: 'static'});
		modalContent.$components = [
			{ class: "modal-dialog " + ( obj.dialogClass || "" ),
				$components: [
					{ class: "modal-content",
						$components: [
							{ class: "modal-header",
								$components: [
									{ $type: "span",
										$components: [ ( obj.header || null ) ] },
									button( {
										wrapperClass: "pull-right",
										wrapperStyle: "margin: -13px;",
										icon: "fa fa-times",
										onclick: function() { $('.modal').modal('hide'); },
									} )
								]
							},
							{
								class: "modal-body",
								style: "overflow-x: auto;",
								$components: [ ( obj.body || null ) ]
							}
						]
					}
				]
			}
		];

	},


	_kill: function () {

		$(".modal").modal('hide');

	},


	_clearContents: function () {

		modalContent.$components = [];

	},


	$init: function () {

		$(this).on('hidden.bs.modal', function() {
			this._clearContents();
		} );

		$(this).find('.modal-dialog').scroll( function() {
  		alert("Scrolling");
		} ) ;

	},

};

cell({
	id: "systemEmailAddresses",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System email addresses" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/email_addresses",
						render: function(data) {
							return {
								id: "systemEmailAddressesSearchList",
								$components: [
									{
										class: "text-center",
										$components: [
											{
												$type: "input",
												class: "search form-control",
												$init: function() {
													new List('systemEmailAddressesSearchList', { valueNames: ['searchListItem'] });
												},
												placeholder: "Search",
												style: "width: 200px; margin-bottom: 10px; display: inline-block;",
											},
										]
									},
									{
										$type: "ul",
										class: "list",
										style: "list-style: none; margin-left: -30px;",
										$components: data.map( function( email_address ) {
											switch(email_address.source_type) {
												case 'mailbox': return button({
													class: "searchListItem",
													text: email_address.email_address + " (mailbox)",
													onclick: function() { systemUsersUser._live(email_address.user_uid) },
												});
												case 'alias': return button({
													class: "searchListItem",
													text: email_address.email_address + " (alias)",
													onclick: function() { systemUsersUser._live(email_address.user_uid) },
												});
												case 'distribution_group': return button({
													class: "searchListItem",
													text: email_address.email_address + " (distribution group)",
													onclick: function() { systemEmailDistributionGroup._live(email_address.distribution_group_name) },
												});
											}
										}),
									}
								]
							};
						},
					}),
				]
			}
		} );

	}

});

cell({

	id: "systemEmailDomainsDelete",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System delete email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "name",
										label: "Email domain",
										collection: data.domains,
										required: true,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/domains/',
								method: 'DELETE',
								callbacks: {
									200: systemEmail._live,
								}
							})
						}
					})
				],
			},
		});
	},


});

cell({
	id: "systemEmailDomainsEmailDomain",

	_live: function (email_domain) {

		modal._live ( {
			header: icon( { icon: "fa fa-globe", text: "System email domain" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
						content: { $type: "h4", $text: email_domain }
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email_domains/email_domain/",
						params: {
							email_domain: email_domain,
						},
						render: function(data) {
							return {
								$components: [
									data.default ? {} : button({
										icon: "fa fa-star-o",
										text: "Set as default",
										onclick: function() {
											apiRequest({
												action: "/uadmin/email_domains/set_default",
												data: {
													email_domain: email_domain
												},
												callbacks: {
													200: function () {
														systemEmailDomainsEmailDomain._live(email_domain);
													}
												}
											})
										},
									}),
									button({
										icon: "fa fa-trash-o",
										text: "Delete",
										onclick: function() { systemUsersGroup._live(email_domain) },
									})
								],
							};
						}
					}),
				]
			}
		} );

	}

});

cell({

	id: "systemEmailDomainsNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email/domains/new",
						render: function(response) {
							return form({
								components: [
									formField( {
										type: response.domains.length ? "select_with_input" : "string",
										name: "domain[name]",
										label: "Email domain",
										value: response.domains.length ? response.domains[0] : null,
										collection: response.domains,
										required: true,
									} ),
									formCancel ( {
										onclick: systemEmail._live,
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/domains/',
								method: 'POST',
								callbacks: {
									200: systemEmail._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});

cell({

	id: "systemEmailDistributionGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/distribution_groups",
						render: function(data) {
							return {
								$components: [
									button( {
										onclick: systemEmailDistributionGroupNew._live,
										icon: "fa fa-plus",
										text: "New"
									} ),
									{ $type: "hr" },
									{
										$components: data.map( function( distribution_group ) {
											return {
												$components: [
													button({
														text: distribution_group.name,
														onclick: function() { systemEmailDistributionGroup._live(distribution_group.name) },
													}),
													{ $type: "p", style: "margin-left: 30px;", $text: distribution_group.description }
												]
											};
										})
									}
								],
							};
						}
					}),
				]
			}
		} );

	},


});

cell({

	id: "systemEmailDistributionGroupEdit",

	_live: function (distribution_group_name) {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System edit email distribution group" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email/distribution_groups/edit",
						params: {
							name: distribution_group_name
						},
						render: function(data) {
							return form({
								components: [
									formField({
										type: "hidden",
										name: "name",
										value: distribution_group_name
									}),
									formField( {
										name: "distribution_group[local_part]",
										id: "email_distribution_group_local_part_field",
										label: "Local part (before the @)",
										value: data.local_part,
									} ),
									formField( {
										type: "select",
										name: "distribution_group[domain]",
										id: "email_distribution_group_domain_field",
										label: "Domain",
										value: data.domain,
										collection: data.email_domains,
									} ),
									formField( {
										type: "text",
										name: "distribution_group[description]",
										label: "Description",
										value: data.description,
									} ),
									formCancel ( {
										onclick: function () {
											systemEmailDistributionGroup._live(distribution_group_name)
										},
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/distribution_groups/',
								method: 'PUT',
								callbacks: {
									200: function (data) {
										var new_name = $("#email_distribution_group_local_part_field").val() + '@' + $("#email_distribution_group_domain_field").val();;
										systemEmailDistributionGroup._live(new_name);
									},
								}
							})
						}
					}),
				],
			},
		});
	},


});

cell({

	id: 'systemDistributionGroupEmailAddressesAdd',

	_live: function (distribution_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group add email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: distribution_group_name },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/distribution_groups/email_addresses/new",
						params: {
							distribution_group_name: distribution_group_name
						},
						render: function(data) {

							return form({
								components: [
									formField({
										type: "hidden",
										name: "distribution_group_name",
										value: distribution_group_name
									}),
									formField( {
										type: "select_with_input",
										name: "email_address[address]",
										label: "Email address",
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemEmailDistributionGroup._live(distribution_group_name) } } ),
									formSubmit(),
								],
								action: "/uadmin/email/distribution_groups/email_addresses/",
								method: "POST",
								callbacks: {
									200: function(response) {
										systemEmailDistributionGroup._live(distribution_group_name);
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemDistributionGroupEmailAddressDelete',

	_live: function (distribution_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group remove email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: distribution_group_name },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/distribution_groups/",
						params: {
							name: distribution_group_name
						},
						render: function(data) {

							return form({
								components: [
									formField({
										type: "hidden",
										name: "distribution_group_name",
										value: distribution_group_name
									}),
									formField( {
										type: "select",
										name: "address",
										label: "Email address",
										value: "",
										collectionIncludeBlank: true,
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemEmailDistributionGroup._live(distribution_group_name) } } ),
									formSubmit(),
								],
								action: "/uadmin/email/distribution_groups/email_addresses/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemEmailDistributionGroup._live(distribution_group_name);
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({
	id: "systemEmailDistributionGroup",

	_live: function (distribution_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmailDistributionGroups._live,
						content: {
							$components: [
								{ $type: "h4", $text: distribution_group_name },
							]
						}
					}),
					dataLoader({
						action: "/uadmin/email/distribution_groups/",
						params: {
							name: distribution_group_name
						},
						render: function(data) {
							return {
								$components: [
									{ $type: "p", $text: data.description },
									{
										class: "clearfix",
										$components: [
											button({
												text: "Delete",
												icon: "fa fa-trash-o",
												wrapperClass: "pull-right",
												onclick: function () {
													if ( data.email_addresses.length ) {
														alert("Remove all email addresses first.");
													} else {
														if ( confirm("Are you sure that you want to delete this distribution group?") ) {
															apiRequest({
																action: "/uadmin/email/distribution_groups/",
																method: "DELETE",
																params: {
																	name: distribution_group_name
																},
																callbacks: {
																	200: systemEmailDistributionGroups._live
																}
															});
														};
													};
												}
											}),
											button({
												text: "Edit",
												icon: "fa fa-edit",
												wrapperClass: "pull-left",
												onclick: function () {
													systemEmailDistributionGroupEdit._live( distribution_group_name );
												}
											}),
										]
									},
									hr(),
									{ $type: "label", $text: "Email addresses" },
									{
										class: "clearfix",
										$components: [
											button({
												wrapperClass: "pull-left",
												icon: "fa fa-plus-square-o",
												text: "Add",
												onclick: function () {
													systemDistributionGroupEmailAddressesAdd._live(distribution_group_name);
												},
											}),
											data.email_addresses.length ? button({
												wrapperClass: "pull-right",
												icon: "fa fa-minus-square-o",
												text: "Remove",
												onclick: function () {
													systemDistributionGroupEmailAddressDelete._live(distribution_group_name);
												},
											}) : {},
										]
									},
									{
										$type: "ul",
										$components: data.email_addresses.map( function( email_address ) {
											return { $type: "li", $text: email_address };
										})
									}
								]
							};
						}
					}),
				]
			}
		} );

	}

});

cell({

	id: "systemEmailDistributionGroupNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System new email distribution group" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {
							return form({
								components: [
									formField( {
										name: "distribution_group[local_part]",
										label: "Local part (before the @)",
									} ),
									formField( {
										type: "select",
										name: "distribution_group[domain]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formField( {
										type: "text",
										name: "distribution_group[description]",
										label: "Description",
									} ),
									formCancel ( {
										onclick: systemEmailDistributionGroups._live,
									} ),
									formSubmit(),
								],
								action: '/uadmin/email/distribution_groups/',
								method: 'POST',
								callbacks: {
									200: systemEmailDistributionGroups._live,
								}
							})
						}
					}),
				],
			},
		});
	},


});

cell({

	id: 'systemEmailDomainsDefault',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System email default domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "default_domain[name]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
								],
								action: "/uadmin/email/default_domain",
								method: "PUT",
								callbacks: {
									200: systemEmail._live,
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemEmailSetupEmailDomain',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-star-o", text: "System setup email domain" } ),
			body: {
				$components: [
					dataLoader({
						action: "/uadmin/email/default_domain/new",
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "default_domain[name]",
										label: "Domain",
                    value: data.default,
										collection: data.domains,
									} ),
									formCancel ( { onclick: systemEmail._live } ),
									formSubmit(),
								],
								action: "/uadmin/email/default_domain",
								method: "POST",
								callbacks: {
									200: systemEmail._live,
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: "systemUsers",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System users" } ),
			body: {
				$components: [
					modalNav({
						up: systemControlPanel._live
					}),
					button( {
						wrapperClass: "pull-right",
						onclick: systemUserGroups._live,
						icon: "fa fa-users",
						text: "User groups"
					} ),
					button( {
						onclick: systemUsersNew._live,
						icon: "fa fa-plus",
						text: "New"
					} ),
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts",
						render: function(response) {
							return {
								$components: response.map( function(account) {
									return button({
										text: account.uid + " (" + account.name + ")",
										onclick: function() { systemUsersUser._live(account.uid) },
									});
								}),
							};
						},
					})

				]
			}
		} );
	},

});

cell({

	id: "systemUserGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemUsers._live,
					}),
					dataLoader({
						action: "/uadmin/users/groups",
						render: function(data) {
							return {
								$components: data.map( function( group ) {
									return button({
										text: group,
										onclick: function() { systemUserGroup._live(group) },
									});
								}),
							};
						}
					}),
				]
			}
		} );

	},


});

cell({
	id: "systemEmail",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System email" } ),
			body: {
				$components: [
					modalNav({
						up: systemControlPanel._live,
					}),
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {
							return data.default_domain ? {
								$components: [
									button( {
										wrapperClass: "pull-right",
										onclick: systemEmailDistributionGroups._live,
										icon: "fa fa-share-square-o",
										text: "Distribution groups"
									} ),
									button( {
										onclick: systemEmailAddresses._live,
										icon: "fa fa-envelope-square",
										text: "Addresses"
									} ),
									hr(),
									{ $type: "label", $text: "Domains"},
									{
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												$components: [
													labelText("Default", data.default_domain),
												]
											},
											button( {
												wrapperClass: "pull-right",
												onclick: systemEmailDomainsDefault._live,
												icon: "fa fa-star-o",
												text: "Set default"
											} ),
										]
									},
									{
										class: "clearfix",
										$components: [
											button( {
												wrapperClass: "pull-left",
												onclick: systemEmailDomainsNew._live,
												icon: "fa fa-plus-square-o",
												text: "Add"
											} ),
											button( {
												wrapperClass: "pull-right",
												onclick: systemEmailDomainsDelete._live,
												icon: "fa fa-minus-square-o",
												text: "Remove"
											} ),
										]
									},
									{
										$type: "ul",
										$components: data.domains.map( function( domain ) {
											return { $type: "li", $text: domain };
										})
									},

								],
							} : {
								$components: [
									button( {
										onclick: systemEmailSetupEmailDomain._live,
										icon: "fa fa-pencil-square",
										text: "Setup email domain"
									} )
								]
							};
						}
					}),
				]
			}
		} );

	}

});

cell({
	id: "systemUserGroup",

	_live: function (user_group_name) {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user group" } ),
			body: {
				$components: [
					modalNav({
						up: systemUserGroups._live,
						content: { $type: "h4", $text: user_group_name }
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/groups/",
						params: {
							name: user_group_name
						},
						render: function(data) {
							return ( data.members.length > 0 ) ? {
								$type: "ul",
								class: "list",
								style: "list-style: none; margin-left: -30px;",
								$components: data.members.map( function( user_uid ) {
									return button({
										text: user_uid,
										onclick: function() { systemUsersUser._live(user_uid) },
									});
								}),
							} : { $type: "i", $text: "This group has no members." };
						},
					}),
				]
			}
		} );

	}

});

cell({

	id: "systemUsersUserEdit",

	_live: function( user_uid ) {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System edit user" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function( data ) {
							return form({
								components: [
									{
										class: "row",
										$components: [
											formField( {
												name: "account[first_name]",
												value: data.first_name,
												required: true,
												label: "First name",
												wrapperClass: "col-sm-6",
											} ),
											formField( {
												name: "account[last_name]",
												value: data.last_name,
												required: true,
												label: "Last name",
												wrapperClass: "col-sm-6",
											} ),
										]
									},
									formCancel ( {
										onclick: function () {
											systemUsersUser._live(user_uid);
										}
									} ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/",
								params: { uid: user_uid },
								method: 'PUT',
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid);
									},
								}
							});
						}
					}),
				],
			},
		});
	},


});

cell({

	id: 'systemUserEmailAliasesAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System user add email alias" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email",
						render: function(data) {

							return data.domains.length == 0 ? {
								$components: [
									{ $type: "i", $text: "The system does not have an email domain." },
									button({
										wrapperClass: "pull-right",
										text: "OK",
										icon: "fa fa-check",
										onclick: function() { systemUserEmail._live(user_uid) }
									})
								] } : form({
								components: [
									formField( {
										name: "alias[local_part]",
										label: "Local part (before the @)",
										required: true,
									} ),
									formField( {
										type: "select",
										name: "alias[domain]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/aliases/",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" });
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemUserEmailAliasesRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user remove email alias" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "address",
										label: "Remove email alias",
										value: "",
										collectionIncludeBlank: true,
										collection: data.email.aliases,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/aliases/",
								params: { user_uid: user_uid },
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" });
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemUserEmailDistributionGroupAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System user add email distribution group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/email/distribution_groups/new",
						params: { user_uid: user_uid },
						render: function(data) {
							return data.distribution_groups.length > 0 ? form({
								components: [
									formField( {
										type: "select",
										name: "distribution_group[name]",
										label: "Distribution group",
										value: "",
										collectionIncludeBlank: true,
										collection: data.distribution_groups,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/distribution_groups/",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
									},
								}
							}) : { $components: [
								{ $type: "i", $text: "No distribution groups to add." },
								button({
									wrapperClass: "pull-right",
									text: "OK",
									icon: "fa fa-check",
									onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) }
								})
							] };

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemUserEmailDistributionGroupRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user remove email distribution group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function(data) {
							return form({
								components: [
									formField( {
										type: "select",
										name: "distribution_group_name_and_email_address",
										label: "Distribution group",
										collectionIncludeBlank: true,
										value: "",
										collection: data.email.distribution_groups.map(function(distribution_group){
											return data.mailbox == distribution_group.email_address ?
											[
												distribution_group.name + ":" + distribution_group.email_address,
												distribution_group.name
											] :
											[
												distribution_group.name + ":" + distribution_group.email_address,
												distribution_group.name + " (alias " + distribution_group.email_address + ")"
											];
										}),
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/distribution_groups/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailDistributionGroupsArea" });
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: "systemUserEmail",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user email" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: function() { systemUsersUser._live(user_uid) },
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
							{ $type: "h4", $text: user_uid },
						]
					},
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							return {
								$init: function() {
									if ( opts.scrollTo ) {
										document.getElementById(opts.scrollTo).scrollIntoView();
									}
								},
								$components: [
									{
										$components: [
											dataList( {
												class: "dl-horizontal",
												items: [
													{ label: "Mailbox", data: data.email.mailbox }
												]
											}),
											{
												class: "clearfix",
												$components: [
													button({
														wrapperClass: "pull-right",
														icon: "fa fa-edit",
														text: "Edit",
														onclick: function() {
															systemUserEmailMailboxEdit._live(user_uid);
														}
													}),
													button({
														wrapperClass: "pull-left",
														icon: "fa fa-times",
														text: "Disable",
														onclick: function() {
															(
																data.email.aliases.length ||
																data.email.distribution_groups.length
															) ?
															alert("All email aliases and distribution groups must be removed before mailbox can be disabled.") :
															apiRequest({
																action: "/uadmin/users/accounts/email",
																params: { user_uid: user_uid },
																method: "DELETE",
																callbacks: {
																	200: function() {
																		systemUsersUser._live(user_uid);
																	}
																}
															})
														}
													}),
												]
											},
											legend ( { text: "Aliases", id: "systemUserEmailAliasesArea" } ),
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserEmailAliasesAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserEmailAliasesRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.email.aliases.map( function( emailAlias ) {
													return { $type: "li", $text: emailAlias };
												})
											},
											{ $type: "br" },
											legend ( { text: "Distribution groups", id: "systemUserEmailDistributionGroupsArea" } ),
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserEmailDistributionGroupAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserEmailDistributionGroupRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.email.distribution_groups.map( function( distribution_group ) {
													return distribution_group.email_address == data.email.mailbox ?
														{ $type: "li", $text: distribution_group.name } :
														{ $type: "li", $text: distribution_group.name + " (alias " + distribution_group.email_address + ")" };
												})
											},
											{ $type: "br" },
										]
									},
								]
							};

						},
					})

				]
			}
		} );
	},

});

cell({

	id: 'systemUserEmailMailboxEdit',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user edit mailbox" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/email/edit",
						params: { user_uid: user_uid },
						render: function(data) {

							return data.email_domains.length == 0 ? {
								$components: [
									{ $type: "i", $text: "The system does not have an email domain." },
									button({
										wrapperClass: "pull-right",
										text: "OK",
										icon: "fa fa-check",
										onclick: function() { systemUserEmail._live(user_uid) }
									})
								] } : form({
								components: [
									formField( {
										type: "select",
										name: "email[domain_name]",
										label: "Domain",
										value: data.mailbox_domain,
										collection: data.email_domains,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailArea" }); } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/email",
								params: { user_uid: user_uid },
								method: "PUT",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailArea" });
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemUserEnableEmail',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user enable email" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email",
						params: { uid: user_uid },
						render: function(data) {

							return data.default_domain == "" ? {
								$components: [
									{
										$type: 'i',
										$text: "Set up system email domain first."
									},
									button( { icon: "fa fa-check", wrapperClass: "pull-right", text: "OK", onclick: function() { systemUsersUser._live(user_uid) } } )
								]
							} : form({
								components: [
									formField( {
										type: "select",
										name: "email[domain_name]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/email",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid);
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: 'systemUserUserGroupsAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System add user to group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/groups/new",
						params: { user_uid: user_uid },
						render: function(data) {

							return data.groups.length ? form({
								components: [
									formField( {
										type: "checkboxes",
										name: "groups[names]",
										label: "Group",
										collection: data.groups,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/groups",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserUserGroups._live(user_uid);
									},
								}
							}) : { $components: [
								{ $type: "i", $text: "No groups to add." },
								button({
									wrapperClass: "pull-right",
									text: "OK",
									icon: "fa fa-check",
									onclick: function() { systemUserUserGroups._live(user_uid) }
								})
							] };

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: "systemUserUserGroups",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System user user groups" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
						up: function() { systemUsersUser._live(user_uid) }
					}),
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							return {
								$components: [
									{
										class: "clearfix",
										$components: [
											{
												class: "clearfix",
												$components: [
													button({
														icon: "fa fa-plus-square-o",
														text: "Add",
														wrapperClass: "pull-left",
														onclick: function() { systemUserUserGroupsAdd._live(user_uid) },
													}),
													button({
														icon: "fa fa-minus-square-o",
														text: "Remove",
														wrapperClass: "pull-right",
														onclick: function() { systemUserUserGroupsRemove._live(user_uid) },
													}),
												]
											},
											{
												$type: "ul",
												$components: data.groups.length == 0 ?
												[ { $type: "i", $text: "No groups." } ] :
												data.groups.map( function( group ) {
													return { $type: "li", $text: group };
												})
											},
										]
									},
								]
							};

						},
					})

				]
			}
		} );
	},

});

cell({

	id: 'systemUserUserGroupsRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System remove user from group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select_multiple",
										name: "names",
										label: "Group",
										collection: data.groups,
									} ),
									formCancel ( { onclick: function() { systemUserUserGroups._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/groups",
								params: { user_uid: user_uid },
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserUserGroups._live(user_uid);
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});

cell({

	id: "systemUsersUser",


	_live: function (user_uid, opts={}) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
						up: systemUsers._live
					}),
					{ $type: "hr" },
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function (data) {
							var group_count = data.groups.length;
							var group_text = group_count == 0 ? "No groups" : group_count == 1 ? "1 group" : group_count + " groups";
							return {
								$init: function() {
									if ( opts.scrollTo ) {
										document.getElementById(opts.scrollTo).scrollIntoView();
									}
								},
								$components: [
									button({
										text: "Edit",
										icon: "fa fa-edit",
										wrapperClass: "pull-right",
										onclick: function () {
											systemUsersUserEdit._live(user_uid);
										}
									}),
									dataList({ items: [
										{ label: "Name", data: data.name }
									]}),
									{
										class: "clearfix",
										$components: [
											button({
												text: "Delete",
												icon: "fa fa-trash-o",
												wrapperClass: "pull-right",
												onclick: function () {
													if ( data.email.mailbox ) {
														alert("Disable email first.");
													}	else if ( data.groups.length > 0 ) {
														alert("Remove all groups first.");
													} else {
														if ( confirm("Are you sure that you want to delete user '" + user_uid + "'?") ) {
															apiRequest({
																action: "/uadmin/users/accounts/",
																params: { uid: user_uid},
																method: "DELETE",
																callbacks: {
																	200: function () {
																		systemUsers._live();
																	},
																}
															});
														};
													};
												}
											}),
											button({
												text: "Password",
												icon: "fa fa-user-secret",
												wrapperClass: "pull-left",
												onclick: function () {
													systemUsersEditPassword._live(user_uid);
												}
											}),
										]
									},
									hr(),
									data.email.mailbox ? {
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: data.email.mailbox
											},
											button({
												class: "pull-right",
												icon: "fa fa-envelope",
												text: "Email",
												onclick: function() { systemUserEmail._live(user_uid); },
											})
										]
									} : {
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: "Email not enabled"
											},
											button({
												class: "pull-right",
												icon: "fa fa-envelope",
												text: "Enable email",
												onclick: function() {
													systemUserEnableEmail._live(user_uid);
												},
											}),
										]
									},
									hr(),
									{
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												style: "margin-top: 13px;",
												$text: group_text,
											},
											button({
												icon: "fa fa-users",
												class: "pull-right",
												text: "Groups",
												onclick: function() { systemUserUserGroups._live(user_uid); },
											}),
										]
									},
								]
							};

						},
					})

				]
			}
		} );
	},

});

cell({

	id: "systemUsersEditPassword",

	_live: function ( user_uid ) {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user edit password" } ),
			body: {
				$components: [
					form({
						components: [
							formField( {
								type: "password_with_confirmation",
								name: "password[new]",
								label: "Password",
								required: true,
							} ),
							formCancel ( {
								onclick: function () {
									systemUsersUser._live( user_uid );
								}
							} ),
							formSubmit(),
						],
						action: '/uadmin/users/accounts/password',
						params: { user_uid: user_uid },
						method: 'PUT',
						callbacks: {
							200: function(response) {
								systemUsersUser._live( user_uid );
							},
						}
					}),
				],
			},
		});
	},


});

cell({

	id: "systemUsersNew",

	_live: function () {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System new user" } ),
			body: {
				$components: [
					form({
						components: [
							{
								class: "row",
								$components: [
									formField( {
										name: "account[first_name]",
										required: true,
										label: "First name",
										wrapperClass: "col-sm-6",
									} ),
									formField( {
										name: "account[last_name]",
										required: true,
										label: "Last name",
										wrapperClass: "col-sm-6",
									} ),
								]
							},
							formField( {
								name: "account[uid]",
								label: "UID (username)",
								required: true,
							} ),
							formField( {
								type: "password_with_confirmation",
								name: "account[password]",
								label: "Password",
								required: true,
							} ),
							formCancel ( {
								onclick: function () {
									systemUsers._live();
								}
							} ),
							formSubmit(),
						],
						action: '/uadmin/users/accounts/',
						method: 'POST',
						callbacks: {
							200: function(response) {
								systemUsersUser._live(response.uid);
							},
						}
					}),
				],
			},
		});
	},


});

cell({

	id: "api",

	$init: function() {
		this._buildPool();
	},

	_buildPool: function() {
		this._xhrPool = [];
		$.ajaxSetup({
	    beforeSend: function(jqXHR) {
        api._xhrPool.push(jqXHR);
	    },
	    complete: function(jqXHR) {
        var index = this._xhrPool.indexOf(jqXHR);
        if (index > -1) {
          api._xhrPool.splice(index, 1);
        };
	    }
		});
	},

	_abortAll: function() {
		$.each(this._xhrPool, function(idx, jqXHR) { jqXHR.abort(); });
		this._xhrPool = [];
	},


	_bindForm: function( form ) {
		$(form).submit(function( e ) {

			var data = new FormData(this);
			var method = ( form.method || "POST" );

			var formButons = $(form).find("button.disable_button_on_form_submit");
			formButons.each(
				function( index ) {
					formButons[index]._disableButton();
				}
			);

			$.ajax({
				url: form.action,
				method: method,
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				complete: ( response ) => {
					formButons.each(
						function( index ) {
							formButons[index]._enableButton();
						}
					);
					api._handleResponse( response , { action: form.action, method: form.method, data: data, callbacks: form._callbacks } );
				}
			});

			e.preventDefault();
			return false;

		} );

	},


	_request: function( args ) {
		$.ajax( {
			url: args.action,
			method: ( args.method || "GET" ),
			data: args.data || null,
			complete: function( response ) {
				api._handleResponse( response, args )
			}
		} );
	},


	_handleResponse: function( response, args ) {

		$("#pageLoadingSpinner").fadeOut();

		responseContentType = response.getResponseHeader("Content-Type")

		if ( response.status == 500 || response.status == 404 || response.status == 406 ) {
			main._renderFatalError( JSON.parse(response.responseText).error );
		} else if ( response.status == 0 ) {
			api._handleNoResponse( response, args );
		} else if ( responseContentType == "application/json" ) {
			api._handleJsonResponse(response, args);
		} else if ( responseContentType == "application/octet-stream" ) {
			api._handleStreamResponse(response, args);
		} else if ( responseContentType == "text/html;charset=utf-8" ) {
			api._handleHtmlResponse(response, args);
		} else {
			var backtrace = ( new Error() ).stack.split("\n");
			var message = response.responseText;
			main._renderFatalError( {
				message: message,
				detail: {
					source: "Admin GUI ApiV0 v0.5",
					type: "Client" + response.status,
					text: "Unexpected content_type.\n" + response.statusText,
					args: args,
					backtrace: backtrace[0] }
			} );
		};
	},


	_handleNoResponse: function ( response, args ) {
		var callbacks = args.callbacks || {};
		var callback = callbacks[response.status];
		if ( ( typeof(callback) === "undefined" ) ) {
			this._defaultNoResponseHandler(response, args);
		} else {
			callback();
		};
	},


	_defaultNoResponseHandler: function ( response, args ) {
		main._renderUnavailableSystem();
	},


	_handleHtmlResponse: function( response, args ) {
		document.open('text/html');
		document.write(response.responseText);
		document.close();
		window.history.pushState( {"html":response.responseText},"", args.action );
	},


	_handleStreamResponse: function( response ) {
		var regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		var match = regex.exec( response.getResponseHeader("Content-Disposition") );
		var fileName = match[1].replace(/^"(.*)"$/, '$1') || "engines_file.txt";
		download(new Blob([response.responseText]), fileName, "text/plain");
	},


	_handleJsonResponse: function( response, args ) {

		var callbacks = args.callbacks || {};

		var callback = callbacks[response.status];
		if ( ( typeof(callback) === "undefined" ) ) {
			this._defaultJsonResponseHandler(response, args);
		} else {
			callback( JSON.parse(response.responseText) );
		};

	},


	_defaultJsonResponseHandler: function( response, args ) {
		switch (response.status)	{
			case 200:
				alert('OK.\n\n' +
							JSON.stringify(JSON.parse(response.responseText), null, 2));
				break;
			case 401:
			 	alert("Authentication error.\n\n" + JSON.parse(response.responseText).error.message );
				main._renderSignedOut();
				break;
			case 405:
				alert( JSON.parse(response.responseText).error.message );
				break;
			case 502:
				main._renderUnavailableSystem( JSON.parse(response.responseText).error );
				break;
			case 503:
				main._renderBusySystem( JSON.parse(response.responseText).error );
				break;
			default:
				var backtrace = ( new Error() ).stack.split("\n");

				var message = response.status ? JSON.parse(response.responseText).error.message : "No response.";
				main._renderFatalError( {
					message: message,
					detail: {
						source: "Admin GUI ApiV0 v0.5",
						type: "Client" + response.status,
						text:  "Unexpected status in JSON response handler.\n" + response.statusText,
						args: args,
						backtrace: backtrace[0] }
				} );
		};

	}

});

function authCheck () {
  return apiRequest({
    action: 'system',
    callbacks: {
      200: function () {
        // do nothing
      },
    },
  });
};

function enginesIconSvg(size) {
	return {
		$type: "span",
		$html: `
			<svg width='` + size + `' height='` + size + `' style='vertical-align: middle;'>
			<g transform='scale(` + ( size * 0.3333333 / 100 ) + `)'>
				<path d='
					M 150,300 L 280,225 L 280,75 L 150,0 L 20,75 L 20,225 L 150,300
					M 50,150 A 100,100 0 1,0 250,150 A 100,100 0 1,0 50,150 Z'
					style='fill:#48D;stroke-width:0' fill-rule='evenodd'>
				</path>
			</g>
		</svg>`
	};
};

function containerStateIcon(state) {
	return {
		$type: "span",
		style: "color: " + containerStateIconColor(state),
		$components: [
			icon ( {icon: containerStateIconClass(state) } )
		]
	};
};

function containerStateIconClass(state) {
	if ( state == "stopped" ) {
		return "fa fa-stop"
	} else if ( state == "running" ) {
		return "fa fa-play"
	} else if ( state == "paused" ) {
		return "fa fa-pause"
	} else if ( state == "nocontainer" ) {
		return "fa fa-circle-o"
	} else if ( state == "kill" || state == "create" ) {
		return "fa fa-circle-o-notch fa-spin"
	} else {
		return "fa fa-question"
	};
};

function containerStateIconColor(state) {
	if ( state == "stopped" ) {
		return "darkblue"
	} else if ( state == "running" ) {
		return "green"
	} else if ( state == "paused" ) {
		return "orange"
	} else {
		return "grey"
	};
};

function labelText(label, text) {
  return dataList({
    class: 'dl-horizontal',
    items: [
      { label: label, data: text }
    ]
  })
};

function modalNav( args ) {
	return {
		class: "clearfix",
		$components: [
			args.up ? button( {
				onclick: args.up,
				icon: "fa fa-arrow-up",
				wrapperClass: "pull-right"
			} ) : {},
			args.content || {},
		]
	};
};

function serviceConsumerCreateType( consumableService ) {

  var selectOptions = {	create: "Create new" };
  if ( consumableService.shareable.length > 0 ) {
  	selectOptions.share = "Share existing";
  };
  if ( consumableService.adoptable.length > 0 ) {
  	selectOptions.adopt = "Adopt orphan";
  };
  return selectOptions;

};

function availableHttpProtocols( defaultHttpProtocol ) {

  if ( defaultHttpProtocol == "http_only" ) {
    return [ [ "http_only", "HTTP only" ] ];
  } else if ( defaultHttpProtocol == "https_only" ) {
    return [ [ "https_only", "HTTPS only" ] ]
  } else {
    return [
      [ "https_and_http", "HTTPS and HTTP" ],
      [ "http_and_https", "HTTP and HTTPS" ],
      [ "https_only", "HTTPS only" ],
      [ "http_only", "HTTP only" ]
    ]
  };

};

function downloadTextAsFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function booleanText(booleanData) {
	if (booleanData) {
		return icon( { icon: "fa fa-check", text: "True" } )
	} else {
		return icon( { icon: "fa fa-times", text: "False" } )
	};
};
function collapse(args) {
	return {
		class: ( args.wrapperClass || null ),
		style: ( args.wrapperStyle || null ),
		$components: [
      {
        $init: function () { this.$update() },
        $update: function () {
          this.$components = [
            buttonUnwrapped( {
              icon: "fa fa-caret-right",
              text: args.text,
              onclick: function () {
                $(this).next().next().slideDown('fast');
                $(this).next().show();
                $(this).hide();
              }
            } ),
            buttonUnwrapped( {
              icon: "fa fa-caret-down",
              text: args.text,
              style: "display: none;",
              onclick: function () {
                $(this).next().slideUp('fast');
                $(this).prev().show();
                $(this).hide();
              }
            } ),
            {
              class: "panel panel-default",
              style: "display: none;",
              $components: [ {
                class: "panel-body",
                $components: [ args.body ]
              } ],
            },

          ];

        },

      },
		]
	}
};

function tree (treeData) {
  return {
    $components: [

      {
        $components: [
          {
            class: "tree",
            $components: [
              {
                $type: "ul",
                $components: [
                  treeBranch(treeData)
                ]
              }
            ],
          }
        ]
      },
    ]
  };

};

function treeBranch(branchData) {
  return {
    $type: "li",

    _branchData: branchData,

    $components: [
      {
        class: "btn btn-custom toggle_node",
        title: "Expand " + branchData.name,
        $components: [
          icon ( { icon: "fa fa-caret-right", text: branchData.name } )
        ],
        onclick: function () {
          var children = $(this).parent("li").find("ul");
          if ( children[0].$components.length == 0 ) {
            children[0].$components = [
              {
                $type: "li",
                $components: [
                  pp( branchData.content || branchData.name ),
                ].concat(
                  treeBranchBranches( branchData.children )
                )
              }
            ];
            children.show();
            $(this).attr( "title", "Collapse " + branchData.name ).find( ".fa-caret-right" ).addClass( "fa-caret-down" ).removeClass( "fa-caret-right" );
          } else {
            children.hide("fast");
            children[0].$components = [];
            $(this).attr( "title", "Expand " + branchData.name ).find( ".fa-caret-down" ).addClass( "fa-caret-right" ).removeClass( "fa-caret-down" );
          };
        },
      },
      {
        $type: "ul",
        $components: [

        ]
      }
    ]
  };

};

function treeBranchBranches( branchesData ) {

    return branchesData.map( function (branchData) {
      return treeBranch(branchData);
    } );

};

function css(styleText) {

  cell({
    $type: "style",
    $html: styleText
  });

};

function prettyPrint( args ){
	return {
		$type: "pre",
		id: args.id,
		style: "white-space: pre-wrap; " + ( args.style || "" ),
		$components: [ { $text: JSON.stringify(args.object, null, 2) } ] }
};

function pp( object ) { return prettyPrint( { object: object } ) };

function icon(args) {

	return {
		$type: "span",
		style: args.style || null,
		class: args.class || null,
		$components: [
			{ $type: "i", class: args.icon },
			{ $type: "span", $text: " " + ( args.text || "" ) }
		]
	}
};

function dataList (args) {
	return {
		$type: "dl",
		class: ( args.class || null ),
		$components: args.items.map( function ( item ) {

			return {
				$components: [
					{ $type: "dt", title: item.label, $html: ( item.label || "" ) },
					(
						typeof item.data === 'object' ?
						{ $type: "dd", title: item.label, $components: [ item.data || {} ] } :
						{ $type: "dd", title: item.label, $html: ( item.data || '' ) }
					)
				]
			}
		} )
	};
}

function markdown(mdText) {
	mdText = ( mdText || "" )
		.replace(/\r\n|\r/g, '\n')
		.replace(/\n/g, '  \n')
		.replace(/\t/g, '    ');
	return {
		$html: marked(mdText)
	};
};

function hourglass( args ) {
  return {
    $type: "i",
    class: "fa fa-hourglass-o",
    $init: function() {
      this._animate();
    },
    _animate: function() {
      setTimeout( function() {
        if ( $(this).hasClass("fa-hourglass-o") ) {
          $(this).removeClass("fa-hourglass-o");
          $(this).addClass("fa-hourglass-start");
        } else	if ( $(this).hasClass("fa-hourglass-start") ) {
          $(this).removeClass("fa-hourglass-start");
          $(this).addClass("fa-hourglass-half");
        } else	if ( $(this).hasClass("fa-hourglass-half") ) {
          $(this).removeClass("fa-hourglass-half");
          $(this).addClass("fa-hourglass-end");
        } else	if ( $(this).hasClass("fa-hourglass-end") ) {
          $(this).removeClass("fa-hourglass-end");
          $(this).addClass("fa-hourglass-o");
        };
        this._animate();
      }.bind(this), 1000)
    },
  };
};

function tabs ( args ) {
	return {
		$components: [
			{
				$type: "ul",
				class: "nav nav-tabs",
				style: "margin-bottom: 5px;",
				$components: args.items.map( function (item, i) {
					return {
						$type: "li",
						class: i == 0 ? "active" : "",
						$components: [
							{
								$type: "a",
								$text: item.label,
								onclick: function () {
									$(this).parent().parent().children().removeClass('active');
									$(this).parent().addClass('active');
									$(this).parent().parent().next().children().removeClass('active');
									$(this).parent().parent().next().children().eq(i).addClass('active');
								}
							}
						]

					};
				} )
			},
			{
				class: "tab-content",
				$components: args.items.map( function (item, i) {
					return {
						class: "tab-pane" + ( i == 0 ? " active" : "" ),
						$components: [ item.body ]
					};
				} )
			},
		]
	}
};

function button( args ) {
	return {
		class: ( args.wrapperClass || null ),
		style: ( args.wrapperStyle || null ),
		id: ( args.wrapperId || null ),
		$components: [
			buttonUnwrapped( args )
		]
	}
};

function buttonUnwrapped( args ) {
	return $.extend( {
		$type: "button",
		type: "button",
		id: args.id,
		style: args.style || null,
		class: "btn btn-lg btn-custom " + ( args.class || "" ),
		title: (args.title || args.text || args.for),
		$components: [
			{ $type: "i", class: ( args.icon == false ? "" : args.icon || "fa fa-angle-right" ) },
			{ $type: "span",
			  $text: args.text ? " " + args.text : null }
		],
		onclick: args.onclick,
		onMouseOver: args.onMouseOver,
		onMouseOut: args.onMouseOut,
	}, args.disabled ? { disabled: "disabled" } : {} );
};

function progressBar(obj) {
	return {

		id: ( obj.id || null ),

		_progress: 0,
		_minorProgress: 0,

		$components: [
			{
				class: "progress",
				$components: [
					{
						role: "progressbar",
						class: "major progress-bar progress-bar-striped active"
					},
					{
						role: "progressbar",
						class: "minor progress-bar progress-bar-info progress-bar-striped active"
					}
				]
			},
		],

		_showMinorProgress: function () {
			this._minorProgress = this._minorProgress + 5;
			var remaining = 1000 - this._progress;
			if ( this._minorProgress > remaining ) {
				this._minorProgress = 0
			};
		},

		_setWidth: function ( widthRatio ) {
			this._progress = widthRatio * 1000;
			this._minorProgress = 0;
		},

		$update: function () {
			$(this).find(".major.progress-bar").css('width', (this._progress/10).toString() + '%');
			$(this).find(".minor.progress-bar").css('width', (this._minorProgress/10).toString() + '%');
		}

	}
}

function legend(obj) {
	return {
		$type: "legend",
		style: "font-size: 14px; font-weight: bold; color: #999;",
		$text: obj.text,
		id: obj.id
	};
};

function br() {
	return { $type: "br" };
};

function hr() {
	return { $type: "hr" };
};

function cell(args){
	var varName = '$cell_' + ( args.id || uniqueVarName() );
	window[varName] = $.extend(	{ $cell: true	}, args	);
};

function uniqueVarName() {
	do {
		var varName = 'cellVarName_' + Math.floor( Math.random() * 1e16 );
	} while (
		window['$cell_' + varName] != undefined
	);
	return varName;
};

function apiRequest (args) {

	var query_params = jQuery.param( args.params || {} );

	return api._request({
		action: args.action + "?" + query_params,
		method: args.method,
		data: args.data,
		callbacks: args.callbacks,
	});

};

function dataLoader( args ) {

	return {
		$components: [
			icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
		],
		$init: function() {
			this._load()
		},
		_refresh: function ( data ) {
			this.$components = [
				args.render ? args.render(data) : pp(data)
			];
		},

		_load: function () {
			var target = this;
			apiRequest({
				action: args.action,
				method: args.method,
				params: args.params,
				data: args.data,
				callbacks: {
					200: function(response) {
						target._refresh(response);
					},
					405: function(response) {
						alert( response.error.message )
						target.$components = [ { $text: "Failed to load." } ];
					},
				}
			});

		},

	};

};

var formFieldRadioButtons = function( args ) {
	return formFieldWrapper(
		args,
		{
			style: "margin-left: 10px; margin-top: -10px;",
			id: ( args.id || "" ),
			$components: formFieldRadioButtonsOptions( args )
		}
	);
};

var formFieldRadioButtonsOptions = function( args ) {
	var ary = formFieldCollectionFormat( args );
	return ary.map( function ( option, i ) {
		return {
			class: "radio",
			$components: [
				{
					$type: "label",
					$components: [
						$.extend (
							{
								$type: "input",
								type: "radio",
								name: ( args.name || "" ),
								id: args.id ? ( ( args.id || "" ) + "_" + option[0] ) : "",
								value: option[0],
							},
							( ( args.value == option[0] ) ? { checked: true } : {} ),
							( args.required ? { required: true } : {} )
						),
						{ $type: "span", $text: option[1] }
					]
				}
			]
		}
	} );
};

var formFieldCheckboxes = function( args ) {
	return formFieldWrapper(
		args,
		{
			style: "margin-left: 10px; margin-top: -10px;",
			id: ( args.id || "" ),
			$components: formFieldCheckboxesOptions( args )
		}
	);
};

var formFieldCheckboxesOptions = function( args ) {
	args.collectionIncludeBlank = false;
	values = formFieldCollectionMultipleValues( args.value );
	var ary = formFieldCollectionFormat( args );
	return ary.map( function ( option, i ) {
		return {
			class: "checkbox",
			$components: [
				{
					$type: "label",
					$components: [
						$.extend (
							{
								$type: "input",
								type: "checkbox",
								name: args.name + '[]',
								value: option[0],
								id: ( ( args.id || "" ) + "_" + option[0] ),
							},
							( values.includes( option[0] ) ? { checked: true } : {} )
						),
						{ $type: "span", style: "margin-left: 5px;", $text: ' ' + option[1] }
					]
				}
			]
		}
	} );
};

var formFieldCollectionSelectOptions = function( args ) {
	var ary = formFieldCollectionFormat( args );
	return ary.map( function (option, i) {
		return $.extend (
			{
				$type: "option",
				$text: "" + ( option[1] ),
				value: "" + option[0],
			},
			( ( args.value == option[0] ) ? { selected: "selected" } : {} ),
			( i == 0 && args.collectionIncludeBlank ) ? { disabled: "disabled" } : {}
		)
	} );
};

function formFieldCollectionFormat ( args ) {
  var ary = [];
	var collection_ary_or_obj = args.collection || [];
	if ( collection_ary_or_obj.constructor.name == "Object" ) {
		for ( var prop in collection_ary_or_obj ) {
			ary.push( [ prop, collection_ary_or_obj[prop] ] );
		};
	} else {
		ary = formFieldCollectionFormatLabels( collection_ary_or_obj || [] );
	};
	if ( args.collectionIncludeBlank ) {
		ary = [ [ "", (args.placeholder || "Please select") ] ].concat( ary );
	};
  return ary;
};

function formFieldCollectionFormatLabels( options ) {
  return options.map( function ( option ) {
    if ( option.constructor.name == "String" ) {
      return [ option, option ];
    } else {
      return option;
    };
  });
};

var formFieldCollectionMultipleValues = function( value_string_or_array ) {
  if ( $.isArray( value_string_or_array ) ) {
    return value_string_or_array
  } else {
    if (  value_string_or_array == null ||
          value_string_or_array == '' ) {
      return [];
    } else {
      return value_string_or_array.replace(/\,\s*/g, ',').split(',')
    };
  }
};

function formFieldPassword( args ) {
	return formFieldWrapper(
		args,
		formFieldPasswordUnwrapped( args ),
	);
};

function formFieldPasswordUnwrapped( args ) {

	return formFieldInputUnwrapped(
		$.extend ( {}, args,
			{
				type: "text",
				autocomplete: "off",
				input: formFieldPasswordUnwrappedDoSecurityFont,
				onkeydown: formFieldPasswordUnwrappedDoSecurityFont,
				onkeyup: formFieldPasswordUnwrappedDoSecurityFont,
				init: formFieldPasswordUnwrappedDoSecurityFont
			}
		)
	);

};

function formFieldPasswordUnwrappedDoSecurityFont ( input ) {
	if ( $(input).val().length == 0 ) {
		$(input).css( "font-family", "inherit" );
		$(input).css( "letter-spacing", "inherit" );
		$(input).css( "font-size", "inherit" );
	} else {
		$(input).css( "font-family", "text-security-disc" );
		$(input).css( "letter-spacing", "1px" );
		$(input).css( "font-size", "18px" );
	};
};

var formFieldCheckboxBoolean = function( args ) {

	var checked = [ 'true', 'on', 'yes', '1' ].some( function(option) { return option == ( args.value || "" ).toString().toLowerCase(); } );

	return formFieldWrapper(
		$.extend ( {}, args, { label: false, title: ( args.title || args.label ) } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "input",
					name: ( args.name || "" ),
					id: ( args.id || "" ),
					value: checked ? 'true' : 'false',
					type: "hidden",
				},
				{
					$type: "label",
					$components: [
						$.extend(
							{
								$type: "input",
								title: ( args.title || args.label ),
								required: ( args.required || null ),
								type: "checkbox",
								onchange: function () {
									$(this).parent().prev().val( $(this).prop('checked') );
								},
							},
							checked ? { checked: "checked" } : {},
						),
						args.label == false ? {} : {
							$type: "strong",
							style: "margin-left: 5px;",
							$text: ( args.label || args.name )
						}
					],
				}
			],
		}
	);
};

function formFieldSelectWithInput( args ) {
	var selectCollection = formFieldCollectionFormat( $.extend({}, args, { collectionIncludeBlank: false }) );
	var selectCollectionValues = selectCollection.map( function( item ) { return item[0] } );
	var showSecondaryInput = args.value && !selectCollectionValues.includes( args.value );
	args.collection = [["__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__", "- Custom value -"]].concat( selectCollection );

	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldInputUnwrapped(
					{
						name: args.name,
						id: args.id,
						class: "form_field_select_with_input_hidden_input",
						type: "hidden",
						value: args.value
					}
				),
				formFieldSelectUnwrapped(
					$.extend(
						{},
						args,
						{
							class: "form_field_select_with_input_primary_select",
							value: args.value || '',
							name: "",
						},
						showSecondaryInput ? { value: "__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__" } : {}
					)
				),
				formFieldInputUnwrapped(
					$.extend (
						{},
						args,
						{
							class: "form_field_select_with_input_secondary_input",
							name: "",
							placeholder: "Enter a custom value",
							style: "margin-top: 5px;" + ( showSecondaryInput ? "" : " display: none;" ),
						},
						showSecondaryInput ? {} : { value: '' }
					)
				),
			],
			onchange: function() {
				formFieldSelectWithInputUpdateControl(this);
			},
			$init: function() {
				formFieldSelectWithInputUpdateControl(this);
			},
		}
	);
};

function formFieldSelectWithInputUpdateControl(control) {
	if (
		$(control).find(".form_field_select_with_input_primary_select").val() ==
		"__SELECT_WITH_INPUT__USE_SECONDARY_INPUT__"
	) {
		$(control).find(".form_field_select_with_input_hidden_input").val(
			$(control).find(".form_field_select_with_input_secondary_input" ).val()
		);
		var secondaryInput = $(control).find(".form_field_select_with_input_secondary_input");
		secondaryInput.prop('disabled', false);
		secondaryInput.show();
	} else {
		$(control).find(".form_field_select_with_input_hidden_input").val(
			$(control).find(".form_field_select_with_input_primary_select").val()
		);
		var secondaryInput = $(control).find(".form_field_select_with_input_secondary_input");
		secondaryInput.prop('disabled', true);
		secondaryInput.hide();
	};
};

var formFieldInput = function( args ) {
	return formFieldWrapper(
		args,
		formFieldInputUnwrapped( args )
	);
};

var formFieldInputUnwrapped = function( args ) {

	return $.extend(
		{
			$type: "input",
			class: ( args.class || "" ) + " form-control",
			id: args.id || null,
			style: args.style || null,
			placeholder: args.placeholder || null,
			type: args.type || "text",
			name: args.name || null,
			value: args.value || null,
			pattern: args.pattern || null,
			min: args.min || null,
			max: args.max || null,
			autocomplete: args.autocomplete || null,

			onchange: function(e) {
				if ( args.onchange ) {
					return args.onchange(e)
				};
			},

			oninput: function(e) {

				function checkPattern() {
					if(e.target.validity.patternMismatch) {
						e.target.setCustomValidity(
							args.patternMessage ||
							( 'Must match pattern ' + args.pattern )
						);
						return false;
					} else { e.target.setCustomValidity('')
						return true;
				  };
				}

				if ( args.oninput ) {
					if ( args.oninput(e) ) {
						return checkPattern()
					}
				} else {
					return checkPattern();
				};
			},

			$init: function () {

				var onkeyup = args.onkeyup;
				if (onkeyup) {
					$(this).bind( "keyup paste cut", function () {
						onkeyup(this);
					} );
				};

				var onkeydown = args.onkeydown;
				if (onkeydown) {
					$(this).bind( "keydown", function () {
						onkeydown(this);
					} );
				};

				var init = args.init;
				if (init) {
					init(this);
				};

			},
		},
		args.required ? { required: 'required' } : {},
		args.disabled ? { disabled: 'disabled' } : {},
	);
};

var formFieldCheckbox = function( args ) {

	var checked = [ 'true', 'on', 'yes', '1' ].some( function(option) { return option == ( args.value || "" ).toString().toLowerCase(); } );

	return formFieldWrapper(
		$.extend ( {}, args, { label: false, title: ( args.title || args.label ) } ),
		{
			class: "checkbox",
			style: "margin-left: 10px;",
			$components: [
				{
					$type: "label",
					$components: [
						$.extend(
							{
								$type: "input",
								name: ( args.name || "" ),
								title: ( args.title || args.label ),
								id: ( args.id || "" ),
								required: ( args.required || null ),
								value: '1',
								type: "checkbox",
							},
							checked ? { checked: "checked" } : {},
						),
						args.label == false ? {} : {
							$type: "strong",
							style: "margin-left: 5px;",
							$text: ( args.label )
						}
					],
				}
			],
		}
	);
};

var formFieldSelectMultiple = function( args ) {

	return formFieldWrapper(
		args,
		{
			$components: [
				{
					$type: "select",
					class: args.class + " form-control",
					onchange: function () {
						this.nextSibling._addSelectedItem( {
							value: $(this).val(),
							label: $(this).find(':selected').not("option[value='']").text(),
						} );
					},
					_disableListItem: function( value ) {
						$(this).find("option[value='" + value + "']").prop('disabled', true);
						this._unselect();
					},
					_enableListItem: function( value ) {
						$(this).find("option[value='" + value + "']")[0].removeAttribute('disabled');
						this._unselect();
					},
					_unselect: function () {
						$(this).find("option")[0].removeAttribute('disabled');
						$(this).val(null);
						$(this).find("option").first().prop('disabled', true);
					},
					// Always include blank in select list
					$components: formFieldCollectionSelectOptions( $.extend( {}, args, { collectionIncludeBlank: true, value: '' } ) )
				},
				{
					class: "formFieldSelectMultipleSelectedItems",
					style: "margin-top: 5px;",

					_items: [],
					_itemCount: 0,

					$init: function () {
						items = [];
						var formFieldSelectMultipleSelectedItems = this;
						var preselectedValues = formFieldCollectionMultipleValues( args.value );
						if ( preselectedValues.length ) {
							preselectedValues.map( function( value ) {
								var label = $(formFieldSelectMultipleSelectedItems).prev().find("option[value='" + value + "']").text();
								items.unshift( { value: value, label: label } );
								formFieldSelectMultipleSelectedItems.previousSibling._disableListItem( value );
							} )
						};
						this._items = items;
						this._render();
					},

					_addSelectedItem: function ( item ) {
						this._items.unshift(item);
						this.previousSibling._disableListItem( item.value );
						this._render();
					},

					_removeSelectedItem: function ( item, i ) {
						this._items.splice(i,1);
						this.previousSibling._enableListItem( item.value );
						this._render();
					},

					_render: function () {
						var newItemHasBeenAdded = this._items.length > this._itemCount;
						this._itemCount = this._items.length;
						this.$components = [
							this._itemCount ?
							{
								style: "border: 1px solid #ccc; min-height: 34px; padding: 1px 5px;",
								$components: this._items.map( function(item ,i) {
									return {
										class: "formFieldSelectMultipleSelectedItem",
										style: ( i == 0 && newItemHasBeenAdded ) ? "display: none;" : "",
										$init: function() {
											$(this).fadeIn();
										},
										$components: [
											formFieldInputUnwrapped({
												name: args.name + '[]',
												value: item.value,
												type: 'hidden'
											}),
											{
												class: "clearfix",
												style: "display: block;",
												$components: [
													{
														$text: item.label,
														class: "pull-left",
														style: "padding: 4px 7px;",
													},
													{
														class: "btn btn-custom pull-right",
														style: "padding: 3px 7px;",
														title: "Click to remove",
														$components: [
															icon({icon: "fa fa-times"})
														],
														onclick: function(e) {
															$(e.target).closest(".formFieldSelectMultipleSelectedItem").slideUp(
																'fast', function() {
																	$(e.target).closest(".formFieldSelectMultipleSelectedItems")[0]._removeSelectedItem(item, i);
																}
															);
														}
													}
												],
											}
										]
									}
								} )
							}
							:
							{
								$type: "input",
								class: 'form-control',
								placeholder: "None",
								onfocus: function () {
									$(this).closest(".formFieldSelectMultipleSelectedItems").prev().focus();
								},
								required: args.required,
							}
					 	];
					},
				}
			]
		}

	);
};

var formFieldLanguage = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "select",
			class: "form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			$components: formFieldCollectionSelectOptions ( 
				{ collection: formFieldLanguageCodesCollection, value: args.value } 
			)
		}
	);
};

var formFieldLanguageCodesCollection = {
	ab:	'Abkhazian',
	aa:	'Afar',
	af:	'Afrikaans',
	sq:	'Albanian',
	am:	'Amharic',
	ar:	'Arabic',
	hy:	'Armenian',
	as:	'Assamese',
	ay:	'Aymara',
	az:	'Azerbaijani',
	ba:	'Bashkir',
	eu:	'Basque',
	bn:	'Bengali (Bangla)',
	dz:	'Bhutani',
	bh:	'Bihari',
	bi:	'Bislama',
	br:	'Breton',
	bg:	'Bulgarian',
	my:	'Burmese',
	be:	'Byelorussian (Belarusian)',
	km:	'Cambodian',
	ca:	'Catalan',
	'zh-Hans':	'Chinese (Simplified)',
	'zh-Hant':	'Chinese (Traditional)',
	co:	'Corsican',
	hr:	'Croatian',
	cs:	'Czech',
	da:	'Danish',
	nl:	'Dutch',
	en:	'English',
	eo:	'Esperanto',
	et:	'Estonian',
	fo:	'Faeroese',
	fa:	'Farsi',
	fj:	'Fiji',
	fi:	'Finnish',
	fr:	'French',
	fy:	'Frisian',
	gl:	'Galician',
	gd:	'Gaelic (Scottish)',
	gv:	'Gaelic (Manx)',
	ka:	'Georgian',
	de:	'German',
	el:	'Greek',
	kl:	'Greenlandic',
	gn:	'Guarani',
	gu:	'Gujarati',
	ha:	'Hausa',
	he:	'Hebrew',
	hi:	'Hindi',
	hu:	'Hungarian',
	is:	'Icelandic',
	id:	'Indonesian',
	ia:	'Interlingua',
	ie:	'Interlingue',
	iu:	'Inuktitut',
	ik:	'Inupiak',
	ga:	'Irish',
	it:	'Italian',
	ja:	'Japanese',
	kn:	'Kannada',
	ks:	'Kashmiri',
	kk:	'Kazakh',
	rw:	'Kinyarwanda (Ruanda)',
	ky:	'Kirghiz',
	rn:	'Kirundi (Rundi)',
	ko:	'Korean',
	ku:	'Kurdish',
	lo:	'Laothian',
	la:	'Latin',
	lv:	'Latvian (Lettish)',
	li:	'Limburgish ( Limburger)',
	ln:	'Lingala',
	lt:	'Lithuanian',
	mk:	'Macedonian',
	mg:	'Malagasy',
	ms:	'Malay',
	ml:	'Malayalam',
	mt:	'Maltese',
	mi:	'Maori',
	mr:	'Marathi',
	mo:	'Moldavian',
	mn:	'Mongolian',
	na:	'Nauru',
	ne:	'Nepali',
	no:	'Norwegian',
	oc:	'Occitan',
	or:	'Oriya',
	om:	'Oromo (Afan, Galla)',
	ps:	'Pashto (Pushto)',
	pl:	'Polish',
	pt:	'Portuguese',
	pa:	'Punjabi',
	qu:	'Quechua',
	rm:	'Rhaeto-Romance',
	ro:	'Romanian',
	ru:	'Russian',
	sm:	'Samoan',
	sg:	'Sangro',
	sa:	'Sanskrit',
	sr:	'Serbian',
	sh:	'Serbo-Croatian',
	st:	'Sesotho',
	tn:	'Setswana',
	sn:	'Shona',
	sd:	'Sindhi',
	si:	'Sinhalese',
	ss:	'Siswati',
	sk:	'Slovak',
	sl:	'Slovenian',
	so:	'Somali',
	es:	'Spanish',
	su:	'Sundanese',
	sw:	'Swahili (Kiswahili)',
	sv:	'Swedish',
	tl:	'Tagalog',
	tg:	'Tajik',
	ta:	'Tamil',
	tt:	'Tatar',
	te:	'Telugu',
	th:	'Thai',
	bo:	'Tibetan',
	ti:	'Tigrinya',
	to:	'Tonga',
	ts:	'Tsonga',
	tr:	'Turkish',
	tk:	'Turkmen',
	tw:	'Twi',
	ug:	'Uighur',
	uk:	'Ukrainian',
	ur:	'Urdu',
	uz:	'Uzbek',
	vi:	'Vietnamese',
	vo:	'Volapük',
	cy:	'Welsh',
	wo:	'Wolof',
	xh:	'Xhosa',
	yi:	'Yiddish',
	yo:	'Yoruba',
	zu:	'Zulu'
};

var formFieldCountry = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "select",
			class: "form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			$components: formFieldCollectionSelectOptions ( 
				{ collection: formFieldCountryCodesCollection, value: args.value }
			)
		}
	);
};

var formFieldCountryCodesCollection = {
	AF: "Afghanistan",
	AL: "Albania",
	DZ: "Algeria",
	AS: "American Samoa",
	AD: "Andorra",
	AO: "Angola",
	AQ: "Antarctica",
	AG: "Antigua and Barbuda",
	AR: "Argentina",
	AM: "Armenia",
	AW: "Aruba",
	AU: "Australia",
	AT: "Austria",
	AZ: "Azerbaijan",
	BS: "Bahamas",
	BH: "Bahrain",
	BD: "Bangladesh",
	BB: "Barbados",
	BY: "Belarus",
	BE: "Belgium",
	BZ: "Belize",
	BJ: "Benin",
	BM: "Bermuda",
	BT: "Bhutan",
	BO: "Bolivia",
	BA: "Bosnia and Herzegovina",
	BW: "Botswana",
	BV: "Bouvet Island",
	BR: "Brazil",
	IO: "British Indian Ocean Territory",
	BN: "Brunei Darussalam",
	BG: "Bulgaria",
	BF: "Burkina Faso",
	BI: "Burundi",
	KH: "Cambodia",
	CM: "Cameroon",
	CA: "Canada",
	CV: "Cape Verde",
	KY: "Cayman Islands",
	CF: "Central African Republic",
	TD: "Chad",
	CL: "Chile",
	CN: "China",
	CX: "Christmas Island",
	CC: "Cocos (Keeling) Islands",
	CO: "Colombia",
	KM: "Comoros",
	CG: "Congo",
	CD: "Congo, The Democratic Republic of The",
	CK: "Cook Islands",
	CR: "Costa Rica",
	CI: "CÔte D'ivoire",
	HR: "Croatia",
	CU: "Cuba",
	CY: "Cyprus",
	CZ: "Czech Republic",
	DK: "Denmark",
	DJ: "Djibouti",
	DM: "Dominica",
	DO: "Dominican Republic",
	EC: "Ecuador",
	EG: "Egypt",
	SV: "El Salvador",
	GQ: "Equatorial Guinea",
	ER: "Eritrea",
	EE: "Estonia",
	ET: "Ethiopia",
	FK: "Falkland Islands (Malvinas)",
	FO: "Faroe Islands",
	FJ: "Fiji",
	FI: "Finland",
	FR: "France",
	GF: "French Guiana",
	PF: "French Polynesia",
	TF: "French Southern Territories",
	GA: "Gabon",
	GM: "Gambia",
	GE: "Georgia",
	DE: "Germany",
	GH: "Ghana",
	GI: "Gibraltar",
	GR: "Greece",
	GL: "Greenland",
	GD: "Grenada",
	GP: "Guadeloupe",
	GU: "Guam",
	GT: "Guatemala",
	GN: "Guinea",
	GW: "Guinea Bissau",
	GY: "Guyana",
	HT: "Haiti",
	HM: "Heard Island and Mcdonald Islands",
	HN: "Honduras",
	HK: "Hong Kong",
	HU: "Hungary",
	IS: "Iceland",
	IN: "India",
	ID: "Indonesia",
	IR: "Iran, Islamic Republic of",
	IQ: "Iraq",
	IE: "Ireland",
	IL: "Israel",
	IT: "Italy",
	JM: "Jamaica",
	JP: "Japan",
	JO: "Jordan",
	KZ: "Kazakhstan",
	KE: "Kenya",
	KI: "Kiribati",
	KP: "Korea, Democratic People's Republic of",
	KR: "Korea, Republic of",
	KW: "Kuwait",
	KG: "Kyrgyzstan",
	LA: "Lao People's Democratic Republic",
	LV: "Latvia",
	LB: "Lebanon",
	LS: "Lesotho",
	LR: "Liberia",
	LY: "Libyan Arab Jamahiriya",
	LI: "Liechtenstein",
	LT: "Lithuania",
	LU: "Luxembourg",
	MO: "Macao",
	MK: "Macedonia, The Former Yugoslav Republic of",
	MG: "Madagascar",
	MW: "Malawi",
	MY: "Malaysia",
	MV: "Maldives",
	ML: "Mali",
	MT: "Malta",
	MH: "Marshall Islands",
	MQ: "Martinique",
	MR: "Mauritania",
	MU: "Mauritius",
	YT: "Mayotte",
	MX: "Mexico",
	FM: "Micronesia, Federated States of",
	MD: "Monaco",
	MN: "Mongolia",
	MS: "Montserrat",
	MA: "Morocco",
	MZ: "Mozambique",
	MM: "Myanmar",
	NA: "Namibia",
	NR: "Nauru",
	NP: "Nepal",
	NL: "Netherlands",
	AN: "Netherlands Antilles",
	NC: "New Caledonia",
	NZ: "New Zealand",
	NI: "Nicaragua",
	NE: "Niger",
	NG: "Nigeria",
	NU: "Niue",
	NF: "Norfolk Island",
	MP: "Northern Mariana Islands",
	NO: "Norway",
	OM: "Oman",
	PK: "Pakistan",
	PW: "Palau",
	PS: "Palestinian Territory, Occupied",
	PA: "Panama",
	PG: "Papua New Guinea",
	PY: "Paraguay",
	PE: "Peru",
	PH: "Philippines",
	PN: "Pitcairn",
	PL: "Poland",
	PR: "Puerto Rico",
	QA: "Qatar",
	RE: "RÉunion",
	RO: "Romania",
	RU: "Russian Federation",
	RW: "Rwanda",
	SH: "Saint Helena",
	KN: "Saint Kitts and Nevis",
	LC: "Saint Lucia",
	PM: "Saint Pierre and Miquelon",
	VC: "Saint Vincent and The Grenadines",
	WS: "Samoa",
	SM: "San Marino",
	ST: "Sao Tome and Principe",
	SA: "Saudi Arabia",
	SN: "Senegal",
	CS: "Serbia and Montenegro",
	SC: "Seychelles",
	SL: "Sierra Leone",
	SG: "Singapore",
	SK: "Slovakia",
	SI: "Slovenia",
	SB: "Solomon Islands",
	SO: "Somalia",
	ZA: "South Africa",
	GS: "South Georgia and The South Sandwich Islands",
	ES: "Spain",
	LK: "Sri Lanka",
	SD: "Sudan",
	SR: "Suriname",
	SJ: "Svalbard and Jan Mayen",
	SZ: "Swaziland",
	SE: "Sweden",
	CH: "Switzerland",
	SY: "Syrian Arab Republic",
	TW: "Taiwan, Province of China",
	TJ: "Tajikistan",
	TZ: "Tanzania, United Republic of",
	TH: "Thailand",
	TL: "Timor Leste",
	TG: "Togo",
	TK: "Tokelau",
	TO: "Tonga",
	TT: "Trinidad and Tobago",
	TN: "Tunisia",
	TR: "Turkey",
	TM: "Turkmenistan",
	TC: "Turks and Caicos Islands",
	TV: "Tuvalu",
	UG: "Uganda",
	UA: "Ukraine",
	AE: "United Arab Emirates",
	GB: "United Kingdom",
	US: "United States",
	UM: "United States Minor Outlying Islands",
	UY: "Uruguay",
	UZ: "Uzbekistan",
	VU: "Vanuatu",
	VE: "Venezuela",
	VN: "Viet Nam",
	VG: "Virgin Islands, British",
	VI: "Virgin Islands, U.S.",
	WF: "Wallis and Futuna",
	EH: "Western Sahara",
	YE: "Yemen",
	ZM: "Zambia",
	ZW: "Zimbabwe"
};
var formFieldTimezone = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "select",
			class: "form-control",
			name: ( args.name || "" ),
			id: ( args.id || "" ),
			$components: formFieldCollectionSelectOptions (
				{ collection: formFieldTimezonesCollection, value: args.value }
			)
		}
	);
};

var formFieldTimezonesCollection = {
	"Pacific/Pago_Pago": "(GMT-11:00) American Samoa",
	"Pacific/Midway": "(GMT-11:00) Midway Island",
	"Pacific/Honolulu": "(GMT-10:00) Hawaii",
	"America/Juneau": "(GMT-09:00) Alaska",
	"America/New_York": "(GMT-05:00) Eastern Time (US &amp;amp; Canada)",
	"America/Tijuana": "(GMT-08:00) Tijuana",
	"America/Phoenix": "(GMT-07:00) Arizona",
	"America/Chihuahua": "(GMT-07:00) Chihuahua",
	"America/Mazatlan": "(GMT-07:00) Mazatlan",
	"America/Guatemala": "(GMT-06:00) Central America",
	"America/Mexico_City": "(GMT-06:00) Mexico City",
	"America/Monterrey": "(GMT-06:00) Monterrey",
	"America/Regina": "(GMT-06:00) Saskatchewan",
	"America/Bogota": "(GMT-05:00) Bogota",
	"America/Indiana/Indianapolis": "(GMT-05:00) Indiana (East)",
	"America/Lima": "(GMT-05:00) Quito",
	"America/Halifax": "(GMT-04:00) Atlantic Time (Canada)",
	"America/Caracas": "(GMT-04:00) Caracas",
	"America/Guyana": "(GMT-04:00) Georgetown",
	"America/La_Paz": "(GMT-04:00) La Paz",
	"America/Santiago": "(GMT-04:00) Santiago",
	"America/St_Johns": "(GMT-03:30) Newfoundland",
	"America/Sao_Paulo": "(GMT-03:00) Brasilia",
	"America/Argentina/Buenos_Aires": "(GMT-03:00) Buenos Aires",
	"America/Godthab": "(GMT-03:00) Greenland",
	"America/Montevideo": "(GMT-03:00) Montevideo",
	"Atlantic/South_Georgia": "(GMT-02:00) Mid-Atlantic",
	"Atlantic/Azores": "(GMT-01:00) Azores",
	"Atlantic/Cape_Verde": "(GMT-01:00) Cape Verde Is.",
	"Africa/Casablanca": "(GMT+00:00) Casablanca",
	"Europe/Dublin": "(GMT+00:00) Dublin",
	"Europe/London": "(GMT+00:00) London",
	"Europe/Lisbon": "(GMT+00:00) Lisbon",
	"Africa/Monrovia": "(GMT+00:00) Monrovia",
	"Etc/UTC": "(GMT+00:00) UTC",
	"Europe/Amsterdam": "(GMT+01:00) Amsterdam",
	"Europe/Belgrade": "(GMT+01:00) Belgrade",
	"Europe/Berlin": "(GMT+01:00) Berlin",
	"Europe/Zurich": "(GMT+01:00) Zurich",
	"Europe/Bratislava": "(GMT+01:00) Bratislava",
	"Europe/Brussels": "(GMT+01:00) Brussels",
	"Europe/Budapest": "(GMT+01:00) Budapest",
	"Europe/Copenhagen": "(GMT+01:00) Copenhagen",
	"Europe/Ljubljana": "(GMT+01:00) Ljubljana",
	"Europe/Madrid": "(GMT+01:00) Madrid",
	"Europe/Paris": "(GMT+01:00) Paris",
	"Europe/Prague": "(GMT+01:00) Prague",
	"Europe/Rome": "(GMT+01:00) Rome",
	"Europe/Sarajevo": "(GMT+01:00) Sarajevo",
	"Europe/Skopje": "(GMT+01:00) Skopje",
	"Europe/Stockholm": "(GMT+01:00) Stockholm",
	"Europe/Vienna": "(GMT+01:00) Vienna",
	"Europe/Warsaw": "(GMT+01:00) Warsaw",
	"Africa/Algiers": "(GMT+01:00) West Central Africa",
	"Europe/Zagreb": "(GMT+01:00) Zagreb",
	"Europe/Athens": "(GMT+02:00) Athens",
	"Europe/Bucharest": "(GMT+02:00) Bucharest",
	"Africa/Cairo": "(GMT+02:00) Cairo",
	"Africa/Harare": "(GMT+02:00) Harare",
	"Europe/Helsinki": "(GMT+02:00) Helsinki",
	"Asia/Jerusalem": "(GMT+02:00) Jerusalem",
	"Europe/Kaliningrad": "(GMT+02:00) Kaliningrad",
	"Europe/Kiev": "(GMT+02:00) Kyiv",
	"Africa/Johannesburg": "(GMT+02:00) Pretoria",
	"Europe/Riga": "(GMT+02:00) Riga",
	"Europe/Sofia": "(GMT+02:00) Sofia",
	"Europe/Tallinn": "(GMT+02:00) Tallinn",
	"Europe/Vilnius": "(GMT+02:00) Vilnius",
	"Asia/Baghdad": "(GMT+03:00) Baghdad",
	"Europe/Istanbul": "(GMT+03:00) Istanbul",
	"Asia/Kuwait": "(GMT+03:00) Kuwait",
	"Europe/Minsk": "(GMT+03:00) Minsk",
	"Europe/Moscow": "(GMT+03:00) St. Petersburg",
	"Africa/Nairobi": "(GMT+03:00) Nairobi",
	"Asia/Riyadh": "(GMT+03:00) Riyadh",
	"Europe/Volgograd": "(GMT+03:00) Volgograd",
	"Asia/Tehran": "(GMT+03:30) Tehran",
	"Asia/Muscat": "(GMT+04:00) Muscat",
	"Asia/Baku": "(GMT+04:00) Baku",
	"Europe/Samara": "(GMT+04:00) Samara",
	"Asia/Tbilisi": "(GMT+04:00) Tbilisi",
	"Asia/Yerevan": "(GMT+04:00) Yerevan",
	"Asia/Kabul": "(GMT+04:30) Kabul",
	"Asia/Yekaterinburg": "(GMT+05:00) Ekaterinburg",
	"Asia/Karachi": "(GMT+05:00) Karachi",
	"Asia/Tashkent": "(GMT+05:00) Tashkent",
	"Asia/Kolkata": "(GMT+05:30) New Delhi",
	"Asia/Colombo": "(GMT+05:30) Sri Jayawardenepura",
	"Asia/Kathmandu": "(GMT+05:45) Kathmandu",
	"Asia/Almaty": "(GMT+06:00) Almaty",
	"Asia/Dhaka": "(GMT+06:00) Dhaka",
	"Asia/Urumqi": "(GMT+06:00) Urumqi",
	"Asia/Rangoon": "(GMT+06:30) Rangoon",
	"Asia/Bangkok": "(GMT+07:00) Hanoi",
	"Asia/Jakarta": "(GMT+07:00) Jakarta",
	"Asia/Krasnoyarsk": "(GMT+07:00) Krasnoyarsk",
	"Asia/Novosibirsk": "(GMT+07:00) Novosibirsk",
	"Asia/Shanghai": "(GMT+08:00) Beijing",
	"Asia/Chongqing": "(GMT+08:00) Chongqing",
	"Asia/Hong_Kong": "(GMT+08:00) Hong Kong",
	"Asia/Irkutsk": "(GMT+08:00) Irkutsk",
	"Asia/Kuala_Lumpur": "(GMT+08:00) Kuala Lumpur",
	"Australia/Perth": "(GMT+08:00) Perth",
	"Asia/Singapore": "(GMT+08:00) Singapore",
	"Asia/Taipei": "(GMT+08:00) Taipei",
	"Asia/Ulaanbaatar": "(GMT+08:00) Ulaanbaatar",
	"Asia/Tokyo": "(GMT+09:00) Tokyo",
	"Asia/Seoul": "(GMT+09:00) Seoul",
	"Asia/Yakutsk": "(GMT+09:00) Yakutsk",
	"Australia/Adelaide": "(GMT+09:30) Adelaide",
	"Australia/Darwin": "(GMT+09:30) Darwin",
	"Australia/Brisbane": "(GMT+10:00) Brisbane",
	"Australia/Melbourne": "(GMT+10:00) Melbourne",
	"Pacific/Guam": "(GMT+10:00) Guam",
	"Australia/Hobart": "(GMT+10:00) Hobart",
	"Pacific/Port_Moresby": "(GMT+10:00) Port Moresby",
	"Australia/Sydney": "(GMT+10:00) Sydney",
	"Asia/Vladivostok": "(GMT+10:00) Vladivostok",
	"Asia/Magadan": "(GMT+11:00) Magadan",
	"Pacific/Noumea": "(GMT+11:00) New Caledonia",
	"Pacific/Guadalcanal": "(GMT+11:00) Solomon Is.",
	"Asia/Srednekolymsk": "(GMT+11:00) Srednekolymsk",
	"Pacific/Auckland": "(GMT+12:00) Wellington",
	"Pacific/Fiji": "(GMT+12:00) Fiji",
	"Asia/Kamchatka": "(GMT+12:00) Kamchatka",
	"Pacific/Majuro": "(GMT+12:00) Marshall Is.",
	"Pacific/Chatham": "(GMT+12:45) Chatham Is.",
	"Pacific/Tongatapu": "(GMT+13:00) Nuku'alofa",
	"Pacific/Apia": "(GMT+13:00) Samoa",
	"Pacific/Fakaofo": "(GMT+13:00) Tokelau Is.",
};

var formFieldSitePasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,{
			$components: [
				formFieldInputUnwrapped(
					$.extend( {}, args, {
						type: "password",
						oninput: function (e) {
							formFieldSitePasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
				formFieldInputUnwrapped(
					$.extend ( {}, args, {
						type: "password",
						id: args.id + "_confirmation",
						placeholder: "Confirm password",
						style: "margin-top: 5px;",
						oninput: function(e) {
							formFieldSitePasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
			]
		}
	);
};

var formFieldSitePasswordWithConfirmationCheckMatch = function (event) {
	var inputs = event.target.parentElement.children;
	if ( inputs[0].value != inputs[1].value ) {
			inputs[0].setCustomValidity("Passwords must match.");
	} else {
			inputs[0].setCustomValidity("");
	}
};

var formFieldTextArea = function( args ) {
	return formFieldWrapper(
		args,
		{
			$type: "textarea",
			class: "form-control",
			id: ( args.id || null ),
			style: ( args.style || null ),
			placeholder: ( args.placeholder || null ),
			type: ( args.type || "text" ),
			name: ( args.name || null ),
			value: ( args.value || null ),
			required: ( args.required || null ),
			pattern: ( args.pattern || null ),
			min: ( args.min || null ),
			max: ( args.max || null ),

			onchange: function(e) {
				if ( args.onchange ) {
					return args.onchange(e)
				};
			},

			oninput: function(e) {

				function checkPattern() {
					if(e.target.validity.patternMismatch) {
						e.target.setCustomValidity(
							args.patternMessage ||
							( 'Must match pattern ' + args.pattern )
						);
						return false;
					} else { e.target.setCustomValidity('')
						return true;
				  };
				}

				if ( args.oninput ) {
					if ( args.oninput(e) ) {
						return checkPattern()
					}
				} else {
					return checkPattern();
				};
			},

		}
	);
};

var formFieldPasswordWithConfirmation = function( args ) {
	return formFieldWrapper(
		args,
		{
			$components: [
				formFieldPasswordUnwrapped(
					$.extend( {}, args, {
						oninput: function(e) {
							formFieldPasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
				formFieldPasswordUnwrapped(
					$.extend ( {}, args, {
						id: args.id + "_confirmation",
						placeholder: "Confirm password",
						style: "margin-top: 5px;",
						oninput: function(e) {
							formFieldPasswordWithConfirmationCheckMatch(e);
						},
					} )
				),
			]
		}
	);
};

var formFieldPasswordWithConfirmationCheckMatch = function (event) {
	var inputs = event.target.parentElement.children;
	if ( inputs[0].value != inputs[1].value ) {
			inputs[0].setCustomValidity("Passwords must match.");
	} else {
			inputs[0].setCustomValidity("");
	}
};

var formFieldSelect = function( args ) {
	return formFieldWrapper(
		args,
		formFieldSelectUnwrapped( args )
	);
};

var formFieldSelectUnwrapped = function( args ) {
	return {
		$type: "select",
		class: ( args.class || "" ) + " form-control",
		name: ( args.name || "" ),
		id: ( args.id || "" ),
		placeholder: ( args.placeholder || null ),
		required: ( args.required || false ),
		$components: formFieldCollectionSelectOptions( args ),
		onchange: function(e) {
			if ( args.onchange ) {
				return args.onchange(e)
			};
		},
	};
};

function formField(args) {

	switch( args.type )	{
		case "string":
			return formFieldInput($.extend( {}, args, { type: "text" } ) );
		case "text":
			return formFieldTextArea( args );
		case "select":
			return formFieldSelect(args);
		case "select_multiple":
			return formFieldSelectMultiple(args);
		case "select_with_input":
			return formFieldSelectWithInput(args);
		case "radios": // deprecated option
		case "radio_buttons":
			return formFieldRadioButtons(args);
		case "checkbox":
		case "check_box": // deprecated option
			return formFieldCheckbox(args);
		case "boolean": // deprecated option
		case "checkbox_boolean":
			return formFieldCheckboxBoolean(args);
		case "checkboxes":
		case "check_boxes": // deprecated option
			return formFieldCheckboxes(args);
		case "hidden":
			return formFieldInputUnwrapped( args );
		case "country":
			return formFieldCountry( args );
		case "language":
			return formFieldLanguage( args );
		case "timezone":
			return formFieldTimezone( args );
		case "file":
			return formFieldInput( $.extend( {}, args, { style: "height: inherit; " + args.style } ) )
		case "password":
			return formFieldPassword( args );
		case "password_with_confirmation":
			return formFieldPasswordWithConfirmation(args);
		case "site_password":
			return formFieldInput( $.extend( {}, args, { type: "password" } ) );
		case "site_password_with_confirmation":
			return formFieldSitePasswordWithConfirmation(args);
		default:
			return formFieldInput( args );
	};
};

function formFieldWrapper( args, input) {

	return {
		class: "form-group " + ( args.wrapperClass || "" ),
	  title: ( args.title || args.label || args.name || null ),
		style: ( ( args.dependOn || {} ).input ? "display: none;" : "" ) + ( args.wrapperStyle || "" ),
		$components: [
			args.label == false ? {} : {
				$type: "label",
				$text: ( args.label || args.name || null ),
				for: ( args.id || null )
			},
			{ $text: ( args.comment == false ) ? null : ( args.comment || null ) },
			input,
			{ $type: "small", $text: ( args.hint == false ) ? null : ( args.hint || null ) },
		],
		_dependOn: ( args.dependOn || {} ),
		"data-behavior": ( ( args.dependOn || {} ).input ? "dependent" : "" ),
		$init: function () {
			this._doDependOn();
		},
		onchange: function () {
			this._callDependOn();
		},
		_callDependOn: function () {
			$('[data-behavior~=dependent]').each(
				function( i, dependentField ) {
					dependentField._doDependOn();
				}
			);
		},
		_doDependOn: function () {

			if ( this._dependOn.input ) {
				if (
					(
						this._dependOn.value &&
						( new RegExp( this._dependOn.value ) ).test(
							$( "#" + this._dependOn.input).val()
						)
					) ||
					(
						this._dependOn.property &&
						$( "#" + this._dependOn.input).is(
							":" + this._dependOn.property
						)
					)
				) {
					$(this).show();
					$(this).find("input, select").removeAttr('disabled');
				} else {
					$(this).hide();
					$(this).find("input, select").attr('disabled','disabled');;
				};
			};
		}
	}
};

var formCancel = function (obj={}) {
	return {
		class: ( obj.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "button",
				class: "btn btn-lg btn-custom pull-left disable_button_on_form_submit",
				id: "form_cancel_button",
				title: ( obj.title || "Cancel" ),
			 	onclick: ( obj.onclick || modal._kill ),

				$init: function () {
					this._enableButton();
				},

				_disableButton: function () {
					$(this).prop("disabled", "disabled");
				},

				_enableButton: function () {
					$(this).prop("disabled", "");
					this.$components = [
						obj.icon == false ? {} : { $type: "i", class: ( obj.icon || "fa fa-times" ) },
						obj.text == false ? {} : { $type: "span", $text: " " + ( obj.text || "Cancel" ) }
					];
				},

			}
		]
	}
};

function formSubmit( args={} ) {
	return {
		class: ( args.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "submit",
				class: "btn btn-lg btn-custom pull-right disable_button_on_form_submit",
				title: ( args.title || "Submit" ),

				$init: function () {
					this._enableButton();
					args.init && args.init(this);
				},

				_disableButton: function () {
					$(this).prop("disabled", "disabled");
					this.$components = [
						hourglass(),
						{ $type: "span", $text: " " + ( args.disabledText || args.text || "OK" ) }
					];
				},

				_enableButton: function () {
					$(this).prop("disabled", "");
					this.$components = [
						args.icon == false ? {} : { $type: "i", class: ( args.icon || "fa fa-check" ) },
						args.text == false ? {} : { $type: "span", $text: " " + ( args.text || "OK" ) }
					];
				},

			}
		]
	}
};

function form(args) {

	var query_params = jQuery.param( args.params || {} );

	return {
		$type: "form",
		class: "clearfix",
		id: args.id,
		action: args.action + "?" + query_params,
		method: args.method,
		enctype: args.enctype || "application/x-www-form-urlencoded",
		_callbacks: args.callbacks,
		$init: function() {
			this.$components = (typeof args.components === "function") ? args.components(this) : ( args.components || [] );

			if ( args.init ) {
				args.init( this );
			} else {
				api._bindForm( this );
			};

			$(this).find("input:invalid").first().focus();
		},
		_field: function( args ) {
			args._formId = args.id;
			return formField( args );
		},
		_submit: function( args ) {
			args._formId = args.id;
			return formSubmit( args );
		},
		_cencel: function( args ) {
			args._formId = args.id;
			return formCancel( args );
		},

	}
};

function enginesField( args ) {
	return formField( {
		type: dig( args, "input", "type" ),
		name: args.name_prefix ? args.name_prefix + "[" + args.name + "]" : args.name,
		id: args.id || ("enginesFormField_" + args.name).replace(/(\[|\])/g, "_"),
		label: dig( args, "input", "label" ) || args.name,
		value: args.value,
		required: args.mandatory,
		title: dig( args, "input", "title" ) || dig( args, "input", "label" ) || args.name,
		pattern: dig( args, "input", "validation", "pattern" ) ,
		patternMessage: dig( args, "input", "validation", "message" ),
		comment: dig( args, "input", "comment" ),
		hint: dig( args, "input", "hint" ),
		placeholder: dig( args, "input", "placeholder" ),
		collection: dig( args, "input", "collection", "items" ) || [],
		collectionIncludeBlank: dig( args, "input", "collection", "include_blank" )
	} );
};

function dig(obj, ...keys) {

  for (var key in keys) {
    if ( obj == null ) {
      return null;
    } else {
      obj = obj[ keys[key] ] || null;
    }
  };

  return obj;

};

// Make links open with target=href, to cause open in new tab (or window)

var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace("<a","<a target='" + href + "' ");
};

marked.setOptions({
    renderer: renderer
});

function openUrl(url) {

  if ( url ) {

    var target = window.open(url, url);

    if ( target ) {
      target.focus();
    } else {
      alert('Your browser is blocking popups for this website.');
    };

  } else {

    alert('This link does not have a URL.');
    
  };

};

function groupArrayBy( ary, key ) {

  result = {};

  ary.map( function ( item ) {
    var group = result[item[key]] || [];
    group.push( item );
    result[item[key]] = group;
  } );

  return result;
  
};

css( `

.system { box-shadow: 0 3px 9px rgba(0,0,0,.5); border: 1px solid #eee; padding: 15px; }
.system .services { border-top: 1px solid #eee; }

@media (min-width: 768px) {
  .system-containers {
      -webkit-column-count: 2;
      -moz-column-count: 2;
      column-count: 2;
  }
}
@media (min-width: 992px) {
  .system-containers {
      -webkit-column-count: 3;
      -moz-column-count: 3;
      column-count: 3;
  }
}
@media (min-width: 1200px) {
  .system-containers {
      -webkit-column-count: 4;
      -moz-column-count: 4;
      column-count: 4;
  }
}

`);

css( `

.tree {
  min-height:20px;
  margin-top:10px;
}
.tree ul:first-child { padding-left: 0px; }
.tree pre {
  margin: 0px;
  margin-bottom: 15px;
  padding: 6px 12px;
  line-height: 1.538461538;
  display: inline-block;
 }
.tree ul {
  padding-left: 36px;
}
 .tree li {
  list-style-type:none;
  margin:0;
  margin-top:0px;
  margin-bottom: 0px;
  padding:0px;
  position:relative
}
.tree li::before, .tree li::after {
  content:'';
  left:-20px;
  position:absolute;
  right:auto
}
.tree li::before {
  border-left: 1px solid #ccc;
  height: calc(100% + 20px);
  top:-40px;
  width:1px
}
.tree li::after {
  border-top: 1px solid #ccc;
  height:20px;
  top:16px;
  width:20px
}
.tree li span {
  margin-top: 0px;
}
.tree>ul>li::before, .tree>ul>li::after {
  border:0;
}
.tree li:last-child::before {
  height:55px;
  top: -38px;
}
.tree li:first-child::before {
  top:-15px;
  height: 32px;
}
.tree li .toggle_node {
  margin-bottom: 15px;
  border: 1px solid #ccc;
}

`);

css( `
select:invalid, textarea:invalid, input:invalid {
	border-color: #48D;
	-webkit-box-shadow: 0 0 8px #48D;
  box-shadow: 0 0 8px #48D;
}

.checkbox input:invalid {
  background-color: #48D;
	-webkit-box-shadow: 0 0 8px #48D;
  box-shadow: 0 0 8px #48D;
}
`);

css( `
  * {
  border-radius: 0 !important;
}` );

css( `

.pull-right-md {
  text-align: right;
  left: auto;
  right: 0;
  float: right;
}

.pull-left-md {
  text-align: left;
  right: auto;
  left: 0;
  float: left;
}

@media (max-width: 767px) {
  .pull-right-md {
    text-align: left;
    left: 0;
    right: auto;
    float: inherit;
  }

	.pull-left-md {
    text-align: left;
    left: 0;
    right: auto;
    float: inherit;
  }

}
`);

css( `
.btn.btn-xlg {font-size: 24px;}
.btn.btn-md {
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
}
.btn.btn-custom { text-align: left; color: #48d; background-color: transparent; border-radius: 0px; }
.btn.btn-custom:hover { text-decoration: none; color: #333; }
.btn.btn-custom:active { box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.25); }
.bootstrap-select .btn { background-image: none; }
`);

cell({

	id: "main",

	$init: function () {
		navbar._live();
		system._live();
	},


	_signOut: function () {
		apiRequest( {
			action: "/system/signin",
			method: "DELETE",
			callbacks: {
				200: function() {
					main._renderSignedOut();
				}
			},
		});
	},

	_renderSignedIn: function (system_ip) {
		navbarSystemIp.$text = system_ip;
		$("#pageLoadingSpinner").fadeIn();
		signIn._kill();
		system._live();
	},

	_renderSignedOut: function () {
		$(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		if ( remoteManagement ) { navbarSystemIp.$text = ""; };
		api._abortAll();
		system._kill();
		signIn._live();
		systemDisconnected._kill();
	},


	_renderSelectSystem: function () {
		$("#pageLoadingSpinner").fadeOut();
		selectSystem._live();
	},


	_renderDisconnectedSystem: function () {
		$(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		$("#pageLoadingSpinner").fadeOut();
		system._kill();
		signIn._kill();
		systemDisconnected._live();
	},


	_renderUnavailableSystem: function( opts={} ) {
		// opts: { message: "????" }
		api._abortAll();
		system._kill();
		signIn._kill();
		systemUnavailable._live( opts );
	},

	_renderBusySystem: function( opts={} ) {
		// opts: { behavior: :engines_update, :engines_restart, :base_os_update, :base_os_restart }
		api._abortAll();
		system._kill();
		signIn._kill();
		systemBusy._live( opts );
	},


	_renderFatalError: function ( error ) {
		this._renderDisconnectedSystem();
		api._abortAll();
		fatalError._live( error );
	},


});
