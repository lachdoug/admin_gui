var $appServicesPersistent = {

	$cell: true,
	id: "appServicesPersistent",

	_appName: null,
	_persistentService: null,


	_live: function( appName, persistentService ) {

		this._appName = appName;
		this._persistentService = persistentService;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-compass",
					text: "App persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServices._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesPersistent._persistentService.label },
						{ $type: "p", $text: appServicesPersistent._persistentService.description },
						{ $type: "hr" },
						appServicesPersistent._form(),
					]
				}
			}
		);

	},

	_form: function () {




		return form ( {
			components: [
				formField( {
					name: "form[definition_path]",
					type: "hidden",
					value: appServicesPersistent._persistentService.definition_path
				} ),
				formField( {
					name: "form[service_handle]",
					type: "hidden",
					value: appServicesPersistent._persistentService.service_handle
				} ),
				{
					$components: appServicesPersistent._persistentService.params.map( function( param ) {
						return enginesField( param );
					})
				},
				formCancel ( { onclick: () => { appServices._live( appServicesPersistent._appName ); } } ),
				formSubmit(),
				pp( { object: appServicesPersistent._persistentService } ),
			],
			action: "/system/default_site",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});
	}

};
