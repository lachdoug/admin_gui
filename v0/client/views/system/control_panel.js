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
									button( { onclick: systemLabel._live,
														icon: "fa fa-window-maximize", text: "Label" } ),
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
