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

						// button( {
						// 	icon: "fa fa-question-circle-o",
						// 	text: "Environment",
						// 	onclick: function () { serviceDiagnosticsEnvironment._live(serviceName); },
						// } ),

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

						// button( {
						// 	icon: "fa fa-plus",
						// 	text: "Available services",
						// 	onclick: function () { serviceAvailableServices._live(serviceName); },
						// } ),

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
