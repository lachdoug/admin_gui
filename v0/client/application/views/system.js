var $system = {

	$cell: true,
	id: "system",

	_systemData: null,
	_containerEvents: null,


	_refresh: function(data) {

		this._streamContainerEvents();
		this._systemData = data;
		if ( data.builder.current.engine_name ) {
			$$("#installBuilding")._live();
		};

	},


	$update: function(){

		if (this._systemData) {

			var needsAttention = 	this._systemData.status.needs_reboot ||
														this._systemData.status.needs_engines_update ||
														this._systemData.status.needs_base_update;

			this.$components = [
				( this._systemData.properties.label.text ? {
					$text: this._systemData.properties.label.text,
					style: ( "color: " + this._systemData.properties.label.color +
									 "; background-color: " + this._systemData.properties.label.background_color +
									"; text-align: center; padding: 10px; font-size: 24px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;" )
				} : {} ),
				{
					class: "container",
					$components: [
						{
							class: "modal-content",
							style: "margin-top: 20px; padding: 10px;",
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
											onclick: "systemMenu._live();"
										},
 									]
								},
								{
									class: "system-containers",
									$components: this._systemData.apps.map( function(app) {
										return system._systemAppTemplate(app);
									} )
								},
								{ $type: "hr" },
								{ class: "system-containers",
									$components: this._systemData.services.map( function(service) {
										return system._systemServiceTemplate(service);
									} )
								}
							]
						}
					]
				},
			]
		} else {
			this.$components = [];
		}

	},


	_live: function() {

		this._loadSystem();

	},


	_kill: function() {

		this._closeContainerEvents();
		this._systemData = null;

	},


	_loadSystem: function () {

		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					$$("#system")._refresh(response);
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

		return this._systemData.apps.find( function( appData ) {
			return appData.name == appName
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
			serverApiUrl + '/system/container_events'
		);
		this._containerEvents.onmessage = function(e) {
			var appStateData = JSON.parse(e.data);
			$$("#system")._refreshAppState(appStateData);
		};

	},


	_refreshAppState: function(appStateData) {

		this._systemData.apps.map(
			function(app) {
				if ( app.name == appStateData.name ) {
					app.state = appStateData.state
					$$("#appMenu")._refreshAppState(appStateData);
				};
			}
		);

	},


	_systemAppTemplate: function (app) {

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
		//				pp(app)
					],
					onclick: "$$('#appMenu')._live('" + app.name + "');"
				}
			]
		}
	},


	_systemServiceTemplate: function (service) {

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
		//				pp(service)
					],
					onclick: "$$('#serviceMenu')._live('" + service.name + "');"
				}
			]
		}
	}

};
