var $serviceConfiguration = {

	$cell: true,
	id: "serviceConfiguration",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				// dialogClass: "modal-lg",
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
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceConfigurationContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceConfigurationContent._data.length ?
										serviceConfigurationContent._data.map(
											function( action ) {
												return button( { text: action.label || action.name, onclick: function () { serviceConfigurationNew._live( serviceName, action ) } });
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
			action: "/services/" + this._serviceName + "/configuration",
			callbacks: {
				200: function(response) {
					var configs = Object.values( response );
					// console.log( configs );
					serviceConfigurationContent._refresh( configs );
				}
			}
		});

	},

};
