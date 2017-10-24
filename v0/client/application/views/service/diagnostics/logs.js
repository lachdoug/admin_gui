var $serviceLogs = {

	$cell: true,
	id: "serviceLogs",

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
					icon: "fa fa-list-ol",
					text: "Service diagnostics logs",
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
							onclick: function () { serviceLogs._live( serviceName ); }
						} ),
						{
							id: "serviceLogsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [ this._logs() ];
							},

							_logs: function () {
								return {
									$type: "table",
									class: "table",
									$components: [
										tabs({ items: [
											{ label: "Output", body: { $type: "pre", style: "white-space: pre-wrap;", $text: serviceLogsContent._data.stdout } },
											{ label: "Error", body: { $type: "pre", style: "white-space: pre-wrap;", $text: serviceLogsContent._data.stderr } }
										] })
									]
								};
							}

						}
					]
				}
			}
		);
		this._load();

	},


	_load: function () {

		apiRequest({
			action: "/services/" + this._serviceName + "/logs",
			callbacks: {
				200: function(response) {
					serviceLogsContent._refresh( response );
				}
			}
		});

	},

};
