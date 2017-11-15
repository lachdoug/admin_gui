var $appMemoryEdit = {

	$cell: true,
	id: "appMemoryEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App memory edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appMemoryEdit._appName },
						{ $type: "hr" },
						{
							id: "appMemoryEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appMemoryEdit._form( data ) ];
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
			action: "/apps/" + this._appName + "/memory",
			callbacks: {
				200: function(response) {
					appMemoryEditForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "number",
					name: "data[memory]",
					label: "Memory (MB)",
					value: data.memory
				}),
				formCancel ( { onclick: () => { appMemory._live( appMemoryEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appMemory._live( appMemoryEdit._appName );
				},
			}
		});

	},

};
