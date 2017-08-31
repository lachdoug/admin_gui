var $systemMenu = {

	$cell: true,
	id: "systemMenu",


	_live: function () {

		var baseOsName = system._systemData.properties.version.base_os.name;
		modal._live ( {
			header: icon( { icon: "fa fa-hdd-o", text: "System menu" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( { onclick: "installFromLibrary._live();",
												wrapperClass: "pull-left-md",
												icon: "fa fa-plus", text: "Install app"	} ),
							button( { onclick: "systemControlPanel._live();",
												wrapperClass: "pull-right-md",
												icon: "fa fa-gears", text: "Control panel" } ),
						]
					},
					{ $type: "hr" },
					{
						class: "clearfix",
						$components: [
							dataList( {
								class: "pull-left-md",
								items: [
									{
										label: "Engines",
										data: system._systemData.properties.version.engines
									},
								]
							} ),
							button( {
								wrapperClass: "pull-right-md",
								onclick: "systemUpdateEngines._live();",
								icon: "fa fa-refresh",
								text: "Update",
								title: "Update Engines"
							} ),
							button( { onclick: "systemRestartEngines._live();", wrapperClass: "pull-right-md",
												icon: "fa fa-play-circle", text: "Restart", title: "Restart Engines" } ),
						]
					},
					( system._systemData.status.needs_engines_update == true ? icon({icon:"fa fa-warning", text: "Needs update", style: "color: red;" }) : {} ),
					{ $type: "hr" },
					{
						class: "clearfix",
						$components: [
							dataList( {
								class: "pull-left-md",
								items: [
									{
										label: system._systemData.properties.version.base_os.name,
										data:  system._systemData.properties.version.base_os.version
									},
								]
							} ),
							button( {
								wrapperClass: "pull-right-md",
								onclick: "systemUpdateBaseOS._live();",
								icon: "fa fa-refresh",
								text: "Update",
								title: "Update " + baseOsName
							} ),
							button( { onclick: "systemRestartBaseOS._live();", wrapperClass: "pull-right-md",
												icon: "fa fa-power-off", text: "Reboot", title: "Restart " + baseOsName + " (reboot system)" } ),
						]
					},
					( system._systemData.status.needs_reboot == true ? icon({icon:"fa fa-warning", text: "Needs reboot", style: "color: red;" }) : {} ),
					( system._systemData.status.needs_base_update == true ? icon({icon:"fa fa-warning", text: "Needs update", style: "color: red;" }) : {} ),
				]
			}
		} );

	}

};
