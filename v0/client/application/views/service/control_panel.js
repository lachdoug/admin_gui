var $serviceControlPanel = {

	$cell: true,
	id: "serviceControlPanel",

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
					icon: "fa fa-cogs",
					text: "Service control panel"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceMenu._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							class: "row",
							$components: [
								{
									class: "col-sm-6",
									$components: [
										button( {
											icon: "fa fa-crosshairs",
											text: "Actions",
											onclick: function () {
												if ( systemServices._dataFor(serviceName).state == "running" ) {
													serviceActions._live(serviceName);
												} else {
													alert("Service must be running to perform actions.")
												}
											},
										} ),
										button( {
											icon: "fa fa-cog",
											text: "Configuration",
											onclick: function () { serviceConfigurations._live(serviceName); },
										} ),
										{ $type: "hr" },
										button( {
											icon: "fa fa-microchip",
											text: "Memory",
											onclick: function () { serviceMemory._live(serviceName); },
										} ),
										{ $type: "hr" },
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
										{ $type: "hr" },
										button( {
											icon: "fa fa-stethoscope",
											text: "Diagnostics",
											onclick: function () { serviceDiagnostics._live(serviceName); },
										} ),
									]
								},
							]
						}
					]
				}
			}
		);

	},

};
