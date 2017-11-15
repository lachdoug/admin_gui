var $systemControlPanel = {

	$cell: true,
	id: "systemControlPanel",


	_live: function () {

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
									button( { onclick: systemAdminUserPassword._live,
														icon: "fa fa-lock", text: "Admin password" } ),
									button( { onclick: systemRegion._live,
														icon: "fa fa-map-marker", text: "Region"	} ),
									button( { onclick: systemDefaultSite._live,
														icon: "fa fa-home", text: "Default site" } ),
									{ $type: "hr" },
									button( { onclick: systemDomains._live,
														icon: "fa fa-globe", text: "Domains" } ),
									button( { onclick: systemCertificates._live,
														icon: "fa fa-certificate", text: "Certificates" } ),
									button( { onclick: systemSshKeys._live,
														icon: "fa fa-key", text: "SSH keys" } ),
									{ $type: "hr" },
									button( { onclick: systemExceptionReporting._live,
														icon: "fa fa-bug", text: "Bugs" } ),
									{ $type: "hr" },
								]
							},
							{
								class: "col-sm-6",
								$components: [
									button( { onclick: installSideLoad._live,
														icon: "fa fa-caret-square-o-right", text: "Side load" } ),
									button( { onclick: systemLastInstall._live,
														icon: "fa fa-history", text: "Last install" } ),
									{ $type: "hr" },
									button( { onclick: systemStatistics._live,
														icon: "fa fa-bar-chart", text: "Statistics" } ),
									{ $type: "hr" },
									button( { onclick: systemRegistry._live,
														icon: "fa fa-arrows", text: "Registry" } ),
									{ $type: "hr" },
									button( { onclick: systemOrphanData._live,
														icon: "fa fa-compass", text: "Orphan data" } ),
									{ $type: "hr" },
									// button( { onclick: systemLogs._live,
									// 					icon: "fa fa-file-text-o", text: "Logs" } ),
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

};
