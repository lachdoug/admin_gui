var $appIcon = {

	$cell: true,
	id: "appIcon",

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
					icon: "fa fa-camera-retro",
					text: "App icon"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appAbout._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{
							id: "appIconContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								var iconUrl = data.icon_url;
								this.$components = [
									{
										$components: [
											iconUrl ? {
												$type: "img",
												src: iconUrl,
												height: "64",
												width: "64"
											} : {
												$type: 'i',
												$text: "None"
											}
										]
									},
									{
										class: "clearfix",
										$components: [
											button( { icon: "fa fa-edit", text: "Edit", class: "pull-right-md", onclick: () => { appIconEdit._live( appName ); } } )
										]
									},
								];
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
			action: "/apps/" + this._appName + "/icon",
			callbacks: {
				200: function( data ) {
					appIconContent._refresh( data );
				},
			}
		});
	},

};
