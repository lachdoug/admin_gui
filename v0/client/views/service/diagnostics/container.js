var $serviceContainer = {

	$cell: true,
	id: "serviceContainer",

	_serviceName: null,


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
					icon: "fa fa-cube",
					text: "Service diagnostics container",
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
						button( {
							icon: "fa fa-repeat",
							text: "Refresh",
							onclick: function () { serviceContainer._live( serviceName ); }
						} ),
						{
							id: "serviceContainerContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ pp( serviceContainerContent._data ) ];
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
			action: "/services/" + this._serviceName + "/container",
			callbacks: {
				200: function(response) {
					serviceContainerContent._refresh( response );
				}
			}
		});

	},

};
