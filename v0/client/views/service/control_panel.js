cell({

	id: "serviceControlPanel",

	_live: function (serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-cogs", text: "Service control panel" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceMenu._live( serviceName ); }
					}),
					hr(),
					dataLoader({
						action: "/services/" + serviceName + "/container",
						render: function(data) {
							return {
								class: "row",
								$components: [
									{
										class: "col-sm-6",
										$components: [
											button( {
												icon: "fa fa-crosshairs",
												text: "Actionators",
												onclick: function () {
													if ( systemServices._dataFor(serviceName).state == "running" ) {
														serviceActionators._live(serviceName);
													} else {
														alert("Service must be running to perform actionators.")
													}
												},
											} ),
											button( {
												icon: "fa fa-cog",
												text: "Configuration",
												onclick: function () { serviceConfigurations._live(serviceName); },
											} ),
											hr(),
											button( {
												icon: "fa fa-microchip",
												text: "Memory",
												onclick: function () { serviceMemory._live(serviceName); },
											} ),
											hr(),
											data.persistent ? { $components: [
												button( {
													icon: "fa fa-database",
													text: "Data",
													onclick: function () { serviceData._live(serviceName); },
												} ),
												hr()
											] } : {}
										]
									},
									{
										class: "col-sm-6",
										$components: [
											button( {
												icon: "fa fa-question-circle-o",
												text: "Environment",
												onclick: function () { serviceEnvironmentVariables._live(serviceName); },
											} ),
											button( {
												icon: "fa fa-compass",
												text: "Services",
												onclick: function () { serviceServices._live(serviceName); },
											} ),
											button( {
												icon: "fa fa-map-signs",
												text: "Consumers",
												onclick: function () { serviceConsumers._live(serviceName); },
											} ),
											hr(),
											button( {
												icon: "fa fa-stethoscope",
												text: "Diagnostics",
												onclick: function () { serviceDiagnostics._live(serviceName); },
											} ),
										]
									},
								]
							};
						},
					}),
				],
			}
		});

	},

});
