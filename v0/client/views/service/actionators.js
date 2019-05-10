cell({

	id: "serviceActionators",

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
					text: "Service actions",
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
							id: "serviceActionatorsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceActionatorsContent._data.length ?
										serviceActionatorsContent._data.map(
											function( actionator ) {
												return button( { text: actionator.label || actionator.name, onclick: function () { serviceActionatorsNew._live( serviceName, actionator.name ) } });
											}
										) : [
										{ $type: "i", $text: "This service does not have any actionators." }
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
			action: "/services/" + this._serviceName + "/actionators",
			callbacks: {
				200: function(response) {
					serviceActionatorsContent._refresh( response );
				}
			}
		});

	},

});
