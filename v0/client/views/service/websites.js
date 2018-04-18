var $serviceWebsites = {

	$cell: true,
	id: "serviceWebsites",

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
					icon: "fa fa-globe",
					text: "Service websites"
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
							id: "serviceWebsitesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								this.$components = data.length ?
									data.map( ( website ) => { return button( { text: website, onclick: function() {
										openUrl( website );
									} } ); } ) :
									[ { $type: "i", $text: "None." } ]
							},
						},
					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/services/" + this._serviceName + "/websites",
			callbacks: {
				200: function( data ) {
					serviceWebsitesContent._refresh( data );
				},
			}
		});
	},

};
