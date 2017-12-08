var $appServicesPersistentDelete = {

	$cell: true,
	id: "appServicesPersistentDelete",
	_appName: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		var queryString =
			"publisher_namespace=" + encodeURIComponent( publisherNamespace ) +
			"&type_path=" + encodeURIComponent( typePath ) +
			"&service_handle=" + encodeURIComponent( serviceHandle );

		modal._live(
			{
				header: icon ( {
					icon: "fa fa-minus-square",
					text: "App uninstall"
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						form( {
							components: [
								formField( {
									type: "checkbox_boolean",
									name: "data[delete_data]",
									label: "Delete data",
									class: "text-center"
								} ),
								formCancel ( {
									onclick: function () {
										appServicesPersistent._live(
											appName, publisherNamespace, typePath, serviceHandle
										);
									}
								} ),
								formSubmit(),
							],


							method: "DELETE",
							action: "/apps/" + this._appName +
									"/service_manager/persistent/?" + queryString,
							callbacks: {
								200: function(response) {
									appServices._live( appName );
								},
							},

						} )
					]
				}
			}
		);
	},



};
