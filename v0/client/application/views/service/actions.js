var $serviceActions = {

	$cell: true,
	id: "serviceActions",

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
							id: "serviceActionsContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components =
									serviceActionsContent._data.length ?
										serviceActionsContent._data.map(
											function( action ) {
												return button( { text: action.label || action.name, onclick: function () { serviceActionsNew._live( serviceName, action ) } });
											}
										) : [
										{ $type: "i", $text: "This service does not have any actions." }
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
			action: "/services/" + this._serviceName + "/actions",
			callbacks: {
				200: function(response) {
					var actionators = Object.values( response );
					// console.log( actionators );
					serviceActionsContent._refresh( actionators );
				}
			}
		});

	},

};
