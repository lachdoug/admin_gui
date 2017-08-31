var $appWebsites = {

	$cell: true,
	id: "appWebsites",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-globe",
					text: "App websites"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appMenu._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appWebsitesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								this.$components = data.map( ( website ) => { return button( { text: website } ); } )
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
			action: "/apps/" + this._appName + "/websites",
			callbacks: {
				200: function( data ) {
					appWebsitesContent._refresh( data );
				},
			}
		});
	},

};
