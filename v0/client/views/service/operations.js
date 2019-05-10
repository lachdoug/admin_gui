var $serviceOperations = {

	$cell: true,
	id: "serviceOperations",

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
					text: "Service operations",
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
							id: "serviceOperationsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceOperationsContent._data.length ?
										serviceOperationsContent._data.map(
											function( operation ) {
												return button( { text: operation.label || operation.name, onclick: function () { serviceOperationsNew._live( serviceName, operation.name ) } });
											}
										) : [
											{ $type: "i", $text: "This service does not have any operations." }
										];
							},
						},
					]
				}
			}
		);
		this._load();

	},

	_load: function () {

		apiRequest( {
			action: "/services/" + this._serviceName + "/operations",
			callbacks: {
				200: function(response) {
					serviceOperationsContent._refresh( response );
				}
			}
		});

	},

};
