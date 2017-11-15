var $serviceMemoryEdit = {

	$cell: true,
	id: "serviceMemoryEdit",

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
						{ $type: "h4", $text: serviceMemoryEdit._serviceName },
						{ $type: "hr" },
						{
							id: "serviceMemoryEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ serviceMemoryEdit._form( data ) ];
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
					serviceMemoryEditForm._refresh(response);
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
				formCancel ( { onclick: () => { serviceMemory._live( serviceMemoryEdit._serviceName ); } } ),
				formSubmit(),
			],
			action: "/services/" + this._serviceName + "/memory",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					serviceMemory._live( serviceMemoryEdit._serviceName );
				},
			}
		});

	},

};
