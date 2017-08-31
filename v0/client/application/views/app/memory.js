var $appMemory = {

	$cell: true,
	id: "appMemory",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "Memory" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appMemory._appName },
						{ $type: "hr" },
						{
							id: "appMemoryForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appMemory._form( data ) ];
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
					appMemoryForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "number",
					name: "form[memory]",
					label: "Memory (MB)",
					value: data.memory
				}),
				formCancel ( { onclick: () => { appControlPanel._live( appMemory._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appControlPanel._live( appMemory._appName );
				},
			}
		});

	},

};
