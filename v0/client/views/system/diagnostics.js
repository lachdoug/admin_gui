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
