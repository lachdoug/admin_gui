var $serviceConfigurationsShow = {

	$cell: true,
	id: "serviceConfigurationsShow",

	_serviceName: null,
	_configuratorName: null,
	_data: null,


	_live: function (serviceName, configuratorName) {
		this._serviceName = serviceName;
		this._configuratorName = configuratorName;
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/services/" + this._serviceName + "/configuration",
			params: { configurator_name: this._configuratorName },
			callbacks: {
				200: function( response ) {
					serviceConfigurationsShow._show( response )
				},
			}
		});
	},

	_show: function ( data ) {

		var serviceName = this._serviceName;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service configuration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceConfigurations._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: data.label },
						{ $type: "p", $text: data.description },
						dataList({
							class: "dl-horizontal",
							items: data.variables.map( function( variable ) {
								return { label: variable.label, data: variable.value };
							} )
						}),
						button({
							icon: "fa fa-edit",
							class: "pull-right",
							wrapperClass: "clearfix",
							text: "Edit",
							onclick: function () {
								serviceConfigurationsEdit._live( serviceName, data.name )
							}
						}),

					]
				}
			}
		);

	},

};
