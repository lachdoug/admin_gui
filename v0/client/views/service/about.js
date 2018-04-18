cell({

	id: "serviceAbout",

	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},

	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-info-circle",
					text: "Service about"
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
						{
							id: "serviceAboutContent",
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
															dig( data, "title" ) ||
															dig( data, "label" )
														) +
														( version ? " (" + version + ")" : "" )
													},
												]
											},
											{
												class: "panel-body",
												$components: [
													markdown( dig( data, "description" ) )
												]
											}
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
			action: "/services/" + this._serviceName + "/about",
			callbacks: {
				200: function( data ) {
					serviceAboutContent._refresh( data );
				},
			}
		});
	},

});
