var $system = {

	$cell: true,
	id: "system",

	_data: null,

	_showOptions: {
		showServices :showServices,
		showSoftwareTitles: showSoftwareTitles,
	  showContainerMemoryUsage: showContainerMemoryUsage
	},

	_refresh: function(data, afterUpdateCallback ) {

		this._showOptions = {
			showServices :showServices,
			showSoftwareTitles: showSoftwareTitles,
		  showContainerMemoryUsage: showContainerMemoryUsage
		};

		console.log(this._showOptions);

		if ( enableEventStreaming ) {
			this._streamContainerEvents();
		};

		if ( showContainerMemoryUsage ) {
			this._pollContainerMemory();
		};

		this._data = data;
		this._afterUpdateCallback = afterUpdateCallback;

		if ( data.builder.current.engine_name ) {
			installBuild._live();
		};
	//
	},
	//
	//
	$update: function(){

		// if ( this._disconnected ) {

		// } else
		if ( this._data ) {

			console.log({
				showServices :showServices,
				showSoftwareTitles: showSoftwareTitles,
			  showContainerMemoryUsage: showContainerMemoryUsage
			});


			var needsAttention = 	this._data.status.needs_reboot ||
														this._data.status.needs_engines_update ||
														this._data.status.needs_base_update;

			this.$components = [
				( this._data.properties.label.text ? {
					$text: this._data.properties.label.text,
					style: ( "color: " + this._data.properties.label.color +
									 "; background-color: " + this._data.properties.label.background_color +
									"; text-align: center; padding: 10px; font-size: 24px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;" )
				} : {} ),
				{
					class: "container",
					// $init: function () {
					// 	if (showServices) { $('#services').slideDown('fast'); };
					// },
					$components: [
						{
							class: "modal-content",
							style: "margin-top: 20px; margin-bottom: 100px; padding: 10px;",
							$components: [
								{
									id: "displayOptionsButtons",

									_showLoading: function () {
										this.$components = [
											{
												class: "pull-right",
												style: "color: #48d; padding: 10px 16px; font-size: 18px; line-height: 1.3333333;",
												$components: [
													icon( { icon: "fa fa-spinner fa-spin" } )
												]
											}
										];
									},

									$components: [
										showContainerMemoryUsage ?
										button({
											id: "hideContainerMemoryUsageButton",
											class: "pull-right",
											icon: "fa fa-microchip",
											title: "Hide container memory usage",
											onclick: system._hideContainerMemoryUsage
										}) :
										button({
											id: "showContainerMemoryUsageButton",
											style: "color: #999;",
											onMouseOver: "this.style.color='inherit'",
											onMouseOut: "this.style.color='#999'",
											class: "pull-right",
											icon: "fa fa-microchip",
											title: "Show container memory usage",
											onclick: system._showContainerMemoryUsage,
										}),
										showServices ?
										button({
											icon: "fa fa-compass",
											class: "pull-right",
											id: "hideServicesButton",
											title: "Hide services",
											onclick: system._hideServices,
										}) :
										button({
											icon: "fa fa-compass",
											style: "color: #999;",
											onMouseOver: "this.style.color='inherit'",
											onMouseOut: "this.style.color='#999'",
											class: "pull-right",
											id: "showServicesButton",
											title: "Show services",
											onclick: system._showServices,
										}),
										showSoftwareTitles ?
										button({
											id: "hideSoftwareTitlesButton",
											class: "pull-right",
											icon: "fa fa-info",
											title: "Hide software titles",
											onclick: system._hideSoftwareTitles
										}) :
										button({
											id: "showSoftwareTitlesButton",
											style: "color: #999;",
											onMouseOver: "this.style.color='inherit'",
											onMouseOut: "this.style.color='#999'",
											class: "pull-right",
											icon: "fa fa-info",
											title: "Show software titles",
											onclick: system._showSoftwareTitles,
										}),
									]
								},

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
								{
									class: "system-containers",
									$components: this._data.apps.map( function(app) {
										return system._systemApp(app);
									} )
								},
								{
									id: "services",
									style: showServices ? "" : "display: none;",
									$components: [
										{ $type: "hr" },
										{ class: "system-containers",
											$components: this._data.services.map( function(service) {
												return system._systemService(service);
											} )
										}
									]
								},
							]
						}
					]
				},
			];
			if ( this._afterUpdateCallback ) { this._afterUpdateCallback(); };
		} else {
			this.$components = [];
		};

	},


	_live: function( afterUpdateCallback ) {
		if ( systemApiUrl ) {
			this._loadSystem( afterUpdateCallback );
		} else {
			if ( remoteManagement ) {
				selectSystem._live();
			} else {
				alert('No system API URL.')
			};
			// $("#pageLoadingSpinner").fadeOut();
		}
	},


	_kill: function() {
		this._closeContainerEvents();
		this._data = null;
		this.$components = [];
		// $(this).hide();
		// this._disconnected = false;
	},

	// _showDisconnected: function() {
	// 	this._closeContainerEvents();
	// 	this._data = null;
	// 	this._disconnected = true;
	// },

	_loadSystem: function ( afterUpdateCallback ) {
		// console.log("get /system from system._loadSystem");
		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					// console.log("got /system");
					system._refresh(response, afterUpdateCallback);
					$("#navbarSignOutButton").show();
					$("#pageLoadingSpinner").fadeOut();
				},
				401: function() {
					// override default behaviour to skip alert message.
					main._renderSignedOut();
				}
			}
		});

	},


	_appDataFor: function (appName) {

		return this._data.apps.find( function( appData ) {
			return appData.name == appName
		} );

	},

	_serviceDataFor: function (serviceName) {

		return this._data.services.find( function( serviceData ) {
			return serviceData.name == serviceName
		} );

	},


	_closeContainerEvents: function () {

		if (this._containerEvents) {
			this._containerEvents.close();
			this._containerEvents = null
		};

	},

	_containerEventsStreamRunning: function () {
		return ( this._containerEvents && ( this._containerEvents.readyState != 2 ) )
	},

	_streamContainerEvents: function () {
		if ( !this._containerEventsStreamRunning() ) {
			// debugger;
			this._closeContainerEvents();
			this._containerEvents = new EventSource(
				'/system/container_events'
			);
			this._containerEvents.onmessage = function(e) {
				var event = JSON.parse(e.data);
				console.log(event);
				system._handleContainerEvent( event );
				appMenu._handleContainerEvent( event );
				serviceMenu._handleContainerEvent( event );
			};
			// this._containerEvents.onerror = function(e) {
			// 	this._closeContainerEvents;
			// 	alert("Event stream error: Lost connection to the server.");
			// 	system._live();
			// };
		};
	},


	_handleContainerEvent: function( event ) {
		// debugger;
		if ( event.container_type == "service" ) {
			this._data.services.map(
				function( service ) {
					if ( service.name == event.container_name ) {
						return $.extend( service, event.status );
					} else {
						return service;
					};
				}
			);
		} else {
			this._data.apps.map(
				function( app ) {
					if ( app.name == event.container_name ) {
						return $.extend( app, event.status );
					} else {
						return app;
					};
				}
			);
		};
	},


	_systemApp: function( app ) {

		return {
			class: "engines_container",
			$components: [
				{
					$type: "button",
					class: "btn btn-lg btn-custom",
					style: "width: 100%;",
					title: app.name,
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
						showSoftwareTitles ? {
							style: "width: 100%; overflow-x: hidden;",
							$components: [
								{
									$type: "small",
									style: "color: #333",
									$text: app.title
								},
							],
						} : {},
					],
					onclick: function () { appMenu._live( app.name ) }
				},
				showContainerMemoryUsage ?
				{
					style: "border-radius: 5px !important; min-height: 10px; box-shadow: 0px 0px 5px 0px #eee inset;",
					title: app.name + ( app.memory_current ? " memory usage\nCurrent " + (app.memory_current/1024/1024).toFixed(1) + " MB\nPeak " + (app.memory_max/1024/1024).toFixed(1) + " MB\nAllocated " + (app.memory_limit/1024/1024).toFixed(0) + " MB" : " memory usage\nnone" ),
					$components: [
						app.memory_current ?
						{
							style: "line-height: 0px; position: relative;",
							$components: [
								{
									style: "position: absolute; border-radius: 5px !important; background-color: " + ( app.memory_current/app.memory_limit > 0.9 ? "#F00c" : "#48dc") + "; box-shadow: 0px 0px 10px 0px #48d inset; display: inline-block; height: 10px; width: " + app.memory_current / app.memory_limit * 100 + "%;",
								},
								{
									style: "position: absolute; border-radius: 5px !important; background-color: " + ( app.memory_max/app.memory_limit > 0.9 ? "#F003" : "#48d3") + "; display: inline-block; height: 10px; width: " + app.memory_max / app.memory_limit * 100 + "%;",
								}
							]
						} : {}
					],
				} : {},
				// pp(app),
			],

		}
	},


	_systemService: function (service) {

		return {
			class: "engines_container",
			$components: [
				{
					$type: "button",
					class: "btn btn-lg btn-custom",
					style: "width: 100%;",
					title: service.name,
					$components: [
						{
							$components: [
								containerStateIcon(service.state),
								{
									$type: "span",
									$text: service.name
								},
								// ( service.had_oom || service.restart_required ) ? {
								// 	$type: "span",
								// 	$components: [
								// 		{ $type: "span", $html: "&nbsp;" },
								// 		icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
								// 	]
								// } : {},
							]
						},
						showSoftwareTitles ? {
							style: "width: 100%; overflow-x: hidden;",
							$components: [
								{
									$type: "small",
									style: "color: #333",
									$text: service.title
								},
							],
						} : {},
					],
					onclick: function () { serviceMenu._live( service.name ) }
				},
				showContainerMemoryUsage ?
				{
					style: "border-radius: 5px !important; min-height: 10px; box-shadow: 0px 0px 5px 0px #eee inset;",
					title: service.name + ( service.memory_current ? " memory usage\nCurrent " + (service.memory_current/1024/1024).toFixed(1) + " MB\nPeak " + (service.memory_max/1024/1024).toFixed(1) + " MB\nAllocated " + (service.memory_limit/1024/1024).toFixed(0) + " MB" : " memory usage\nnone" ),
					$components: [
						service.memory_current ?
						{
							style: "line-height: 0px; position: relative;",
							$components: [
								{
									style: "position: absolute; border-radius: 5px !important; background-color: " + ( service.memory_current/service.memory_limit > 0.9 ? "#F00c" : "#48dc") + "; box-shadow: 0px 0px 10px 0px #48d inset; display: inline-block; height: 10px; width: " + service.memory_current / service.memory_limit * 100 + "%;",
								},
								{
									style: "position: absolute; border-radius: 5px !important; background-color: " + ( service.memory_max/service.memory_limit > 0.9 ? "#F003" : "#48d3") + "; display: inline-block; height: 10px; width: " + service.memory_max / service.memory_limit * 100 + "%;",
								}
							]
						} : {}
					],
				} : {},
				// pp(service),

			]
		}
	},


	_showSoftwareTitles: function () {
		displayOptionsButtons._showLoading();
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_software_titles: true },
			callbacks: {
				200: function(response) {
					showSoftwareTitles = true;
					system._live();
				},
			}
		});
	},

	_hideSoftwareTitles: function () {
		displayOptionsButtons._showLoading();
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_software_titles: false },
			callbacks: {
				200: function(response) {
					showSoftwareTitles = false;
					system._live();
				},
			}
		});
	},

	_showContainerMemoryUsage: function () {
		displayOptionsButtons._showLoading();
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_container_memory_usage: true },
			callbacks: {
				200: function(response) {
					showContainerMemoryUsage = true;
					system._live();
				},
			}
		});
	},

	_hideContainerMemoryUsage: function () {
		displayOptionsButtons._showLoading();
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_container_memory_usage: false },
			callbacks: {
				200: function(response) {
					showContainerMemoryUsage = false;
					system._live();
				},
			}
		});
	},

	_showServices: function () {
		displayOptionsButtons._showLoading();
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_services: true },
			callbacks: {
				200: function(response) {
					showServices = true;
					system._live();
				},
			}
		});
	},

	_hideServices: function () {
		displayOptionsButtons._showLoading();
		$('#services').slideUp('fast');
		apiRequest({
			action: '/client/display_settings',
			method: "PATCH",
			data: { show_services: false },
			callbacks: {
				200: function(response) {
					showServices = false;
					system._live();
				},
			}
		});
	},

 // function () {
 //  $('#services').slideDown('fast');
 //  $('#hideServicesButton').show();
 //  $(this).hide();
 //  // showServices = true;
 // },
 // function () {
 //  $('#services').slideUp('fast');
 //  $('#showServicesButton').show();
 //  $(this).hide();
 //  // showServices = false;
 // }


	_pollContainerMemory: function () {
		if (showContainerMemoryUsage) {
			apiRequest({
				action: '/system/statistics/container_memory',
				callbacks: {
					200: function(response) {
						if (showContainerMemoryUsage) {
							system._handleMemoryUpdate(response);
							setTimeout( function() {
								// system._pollContainerMemory();
							}, 7000)
						};
					},
				}
			});
		};
	},


	_handleMemoryUpdate: function( data ) {
		console.log(data.containers);
		// if ( event.container_type == "service" ) {
			this._data.services.map(
				function( service ) {
					var memory = data.containers.services[service.name];
					if (memory) {
						return $.extend( service, { memory_current: memory.current, memory_max: memory.maximum, memory_limit: memory.limit } );
					} else {
						return $.extend( service, { memory_current: 0, memory_max: 0, memory_limit: 0 } );
					};
				}
			);
		// } else {
			this._data.apps.map(
				function( app ) {
					var memory = data.containers.applications[app.name];
					if (memory) {
						return $.extend( app, { memory_current: memory.current, memory_max: memory.maximum, memory_limit: memory.limit } );
					} else {
						return $.extend( app, { memory_current: 0, memory_max: 0, memory_limit: 0 } );
					};
				}
			);
		// };
	},


};
