var $serviceConfigurations = {

	$cell: true,
	id: "serviceConfigurations",

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
					icon: "fa fa-crosshairs",
					text: "Service configurations",
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
						{
							id: "serviceConfigurationsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceConfigurationsContent._data.length ?
										serviceConfigurationsContent._data.map(
											function( configuration ) {
												return button( {
													text: ( configuration.label || configuration.name ),
													title: configuration.description || configuration.label || configuration.name,
													onclick: function () {
														configuration.no_save ?
														serviceConfigurationsEdit._live( serviceName, configuration.name ) :
														serviceConfigurationsShow._live( serviceName, configuration.name )
													}
												} );
											}
										) : [
										{ $type: "i", $text: "This service does not have any configurations." }
										];
							},
						}
					]
				}
			}
		);
		this._load();

	},


	_load: function () {

		apiRequest({
			action: "/services/" + this._serviceName + "/configurations",
			callbacks: {
				200: function(response) {
					var configs = Object.values( response );
					serviceConfigurationsContent._refresh( configs );
				}
			}
		});

	},

};
