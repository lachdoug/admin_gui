var $appServicesPersistentNewType = {

	$cell: true,
	id: "appServicesPersistentNewType",

	_appName: null,
	_persistentService: null,


	_live: function( appName, definitionId ) {

		this._appName = appName;
		this._definitionId = definitionId;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-plus",
					text: "App new persistent service",
				} ),
				body: {
					$components: [
						{ $type: "h4", $text: appName },
						{ $type: "hr" },
						{
							id: "appServicesPersistentNewTypeContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									pp( { object: this._data } ),
									// appServicesPersistentNewType._form(),
								];
							},

						},
					]
				}
			}
		);
		this._load();

	},


	_load: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/available_services/persistent/" + this._definitionId,
			callbacks: {
				200: function(response) {
					appServicesPersistentNewTypeContent._refresh( response );
				}
			}
		});

	},


// /apps/:app_name/available_services/persistent/:definition_id


	// _form: function () {
	//
	// 	return form ( {
	// 		components: [
	// 			formField( {
	// 				name: "form[definition_path]",
	// 				type: "hidden",
	// 				value: appServicesPersistentNewType._persistentService.definition_path
	// 			} ),
	// 			formField( {
	// 				name: "form[service_handle]",
	// 				type: "hidden",
	// 				value: appServicesPersistentNewType._persistentService.service_handle
	// 			} ),
	// 			{
	// 				$components: appServicesPersistentNewType._persistentService.params.map( function( param ) {
	// 					return enginesField( param );
	// 				})
	// 			},
	// 			formCancel ( { onclick: () => { appServices._live( appServicesPersistentNewType._appName ); } } ),
	// 			formSubmit(),
	// 			pp( { object: appServicesPersistentNewType._persistentService } ),
	// 		],
	// 		action: "/system/default_site",
	// 		method: 'PUT',
	// 		callbacks: {
	// 			200: function(response) {
	// 				systemControlPanel._live();
	// 			},
	// 		}
	// 	});
	// }

};
