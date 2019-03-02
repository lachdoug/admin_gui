var $systemMenu = {

	$cell: true,
	id: "systemMenu",


	_live: function () {

		// authCheck(); // this modal does not call api for data, so do fake call to check if auth'd

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
					systemMenu._metricsSummary(),
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

	_metricsSummary: function() {
		return {
			id: "systemMenuMetricsSummary",
			$init: function () {
				apiRequest({
					action: "/system/statistics/summary",
					callbacks: {
						200: function(response) {
							systemMenuMetricsSummary._refresh(response);
						},
					}
				})
			},
			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
			],
			_refresh: function (data) {
				this.$components = [ pp( data ) ];
			},
		}
	},


};
