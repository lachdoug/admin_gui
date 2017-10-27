var $system = {

	$cell: true,
	id: "system",

	_data: null,
	_containerEvents: null,


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

		if (this._data) {

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
		this._loadSystem( afterUpdateCallback );
	},


	_kill: function() {

		this._closeContainerEvents();
		this._data = null;

	},


	_loadSystem: function ( afterUpdateCallback ) {

		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response, afterUpdateCallback);
					$("#navbarSignOutButton").show();
					$("#pageLoadingSpinner").fadeOut();
				},
				401: function() {
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


	_streamContainerEvents: function () {

		this._closeContainerEvents();
		this._containerEvents = new EventSource(
			'/system/container_events'
		);
		this._containerEvents.onmessage = function(e) {
			var event = JSON.parse(e.data);
			// debugger;
			console.log(event);
			system._handleContainerEvent( event );
			appMenu._handleContainerEvent( event );
			serviceMenu._handleContainerEvent( event );
		};

	},


	_handleContainerEvent: function( event ) {
		this._data.apps.map(
			function( app ) {
				if ( app.name == event.container_name ) {
					return $.extend( app, event.status );
				} else {
					return app;
				};
			}
		);
	},


	_systemApp: function( app ) {

		return {
			$components: [
				{
					$type: "button",
					class: "btn btn-lg btn-custom",
					title: app.name + " menu",
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
					],
					onclick: function () { appMenu._live( app.name ) }
				},
				// pp(app),
			]
		}
	},


	_systemService: function (service) {

		return {
			$components: [
				{
					$type: "button",
					class: "btn btn-lg btn-custom",
					title: service.name,
					$components: [
						containerStateIcon(service.state),
						{
							$type: "span",
							$text: service.name
						},
					],
					onclick: function () { serviceMenu._live( service.name ) }
				}
			]
		}
	}

};
