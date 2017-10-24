var $serviceMemory = {

	$cell: true,
	id: "serviceMemory",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "Service memory" } ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceMemory._serviceName },
						{ $type: "hr" },
						{
							id: "serviceMemoryForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ serviceMemory._form( data ) ];
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
			action: "/services/" + this._serviceName + "/memory",
			callbacks: {
				200: function(response) {
					serviceMemoryForm._refresh(response);
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
				formCancel ( { onclick: () => { serviceControlPanel._live( serviceMemory._serviceName ); } } ),
				formSubmit(),
			],
			action: "/services/" + this._serviceName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					serviceControlPanel._live( serviceMemory._serviceName );
				},
			}
		});

	},

};
