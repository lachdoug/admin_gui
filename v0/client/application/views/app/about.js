var $appAbout = {

	$cell: true,
	id: "appAbout",

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
					icon: "fa fa-info-circle",
					text: "App about"
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
						{
							id: "appAboutContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
							],
							_refresh: function ( data ) {
								var version = dig( data, "software", "display", "version" );
								var websiteUrl = dig( data, "software", "display", "url" );
								var licenseUrl = dig(data, "software", "license", "url" );

								this.$components = [
									{
										class: "panel panel-default",
										style: "margin: 15px; box-shadow: 0 2px 5px rgba(0,0,0,.5);",
										$components: [
											{
												class: "panel-heading",
												style: "background-color: #FFF; background-image: none; border-top-left-radius: 3px !important; border-top-right-radius: 3px !important;",
												$components: [
													{
														$type: "h5",
														$text: (
															dig( data, "software", "display", "title" ) ||
															dig( data, "software", "display", "label" )
														) +
														( version ? " (" + version + ")" : "" )
													},
												]
											},
											{
												class: "panel-body",
												$components: [
													markdown( dig( data, "software", "display", "description" ) )
												]
											}
										]
									},
									{
										class: "clearfix",
										$components: [
											button( { icon: "fa fa-external-link", text: "Website", class: "pull-left-md", onclick: () => { websiteUrl ? openUrl( websiteUrl ) : alert("Not available."); } } ),
											button( { icon: "fa fa-external-link", text: "License", class: "pull-right-md", onclick: () => { licenseUrl ? openUrl( licenseUrl ) : alert("Not available."); } } )
										]
									},
									{ $type: 'hr' },
									button( { icon: "fa fa-camera-retro", class: "pull-right-md", text: "Icon", onclick: () => { appIcon._live( appName ); } } ),
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
			action: "/apps/" + this._appName + "/about",
			callbacks: {
				200: function( data ) {
					appAboutContent._refresh( data );
				},
			}
		});
	},

};
