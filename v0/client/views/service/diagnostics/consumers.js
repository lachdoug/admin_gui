cell({

	id: "serviceConsumers",

	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-map-signs",
					text: "Service consumers",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceDiagnostics._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						dataLoader({
							action: "/services/" + serviceName + "/consumers",
						})

					]
				}
			}
		);

	},

});
