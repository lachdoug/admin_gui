var $system = {

	$cell: true,
	id: "system",

	_data: null,
	_containerEvents: null,
	_disconnected: false,


	_refresh: function(data, afterUpdateCallback ) {
		if ( enableEventStreaming ) {
			this._streamContainerEvents();
		};
		this._data = data;
		this._afterUpdateCallback = afterUpdateCallback;

		if ( data.builder.current.engine_name ) {
			installBuild._live();
		};

	},


	$update: function(){

		if ( this._disconnected ) {
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
		} else if ( this._data ) {

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
					$components: [
						{
							class: "modal-content",
							style: "margin-top: 20px; margin-bottom: 100px; padding: 10px;",
							$components: [
								showSoftwareTitles ?
								button({
									id: "hideSoftwareTitlesButton",
									class: "pull-right",
									icon: "fa fa-info",
									onclick: system._hideSoftwareTitles
								}) :
								button({
									id: "showSoftwareTitlesButton",
									class: "pull-right",
									icon: "fa fa-info",
									onclick: system._showSoftwareTitles,
								}),
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
								button({
									icon: "fa fa-caret-down",
									id: "show_services_button",
									title: "Show services",
									style: showServices ? "display: none;" : "",
									onclick: function () {
										$('#services').slideDown('fast');
										$('#hide_services_button').show();
										$(this).hide();
										showServices = true;
									},
								}),
								button({
									icon: "fa fa-caret-up",
									id: "hide_services_button",
									style: showServices ? "" : "display: none;",
									title: "Hide services",
									onclick: function () {
										$('#services').slideUp('fast');
										$('#show_services_button').show();
										$(this).hide();
										showServices = false;
									},
								}),
								{
									id: "services",
									style: showServices ? "" : "display: none;",
									$components: [
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
		}

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
			$("#pageLoadingSpinner").fadeOut();
		}
	},


	_kill: function() {
		this._closeContainerEvents();
		this._data = null;
		this._disconnected = false;
	},

	_showDisconnected: function() {
		this._closeContainerEvents();
		this._data = null;
		this._disconnected = true;
	},

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
				// 401: function() {
				// 	main._renderSignedOut();
				// }
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
			style: "width: 100%;",
			$components: [
				{
					$type: "button",
					class: "btn btn-lg btn-custom",
					style: "width: 100%;",
					title: app.name + " menu",
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
						{
							style: "width: 100%; overflow-x: hidden;",
							$components: [
								{
									$type: "small",
									style: "color: #333",
									$text: app.title
								},
							],
						},
					],
					onclick: function () { appMenu._live( app.name ) }
				},
				// pp(app),
			],

		}
	},


	_systemService: function (service) {

		return {
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
						{
							style: "width: 100%; overflow-x: hidden;",
							$components: [
								{
									$type: "small",
									style: "color: #333",
									$text: service.title
								},
							],
						},


					],
					onclick: function () { serviceMenu._live( service.name ) }
				},
				// pp(service),

			]
		}
	},


	_showSoftwareTitles: function () {
		showSoftwareTitlesButton.$components = [ icon( { icon: "fa fa-spinner fa-spin" } ) ];
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
		hideSoftwareTitlesButton.$components = [ icon( { icon: "fa fa-spinner fa-spin" } ) ];
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


};
