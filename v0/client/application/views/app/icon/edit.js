var $appIconEdit = {

	$cell: true,
	id: "appIconEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App icon edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appIconEdit._appName },
						{ $type: "hr" },
						{
							id: "appIconEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appIconEdit._form( data ) ];
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
			action: "/apps/" + this._appName + "/icon",
			callbacks: {
				200: function(response) {
					appIconEditForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "url",
					name: "data[icon_url]",
					label: "Icon URL",
					value: data.icon_url
				}),
				formCancel ( { onclick: () => { appIcon._live( appIconEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/icon",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appIcon._live( appIconEdit._appName );
				},
			}
		});

	},

};
