var $serviceEnvironmentVariables = {

	$cell: true,
	id: "serviceEnvironmentVariables",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "Service environment variables" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceEnvironmentVariables._serviceName ); }
								} ),
								{ $type: "h4", $text: serviceEnvironmentVariables._serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceEnvironmentVariablesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									dataList({
										class: "dl-horizontal",
										items: data.map( function( variable ) {
											return {
												label: variable.name,
												data: variable.value
											};
										})
									}),
								];
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
			action: "/services/" + this._serviceName + "/environment_variables",
			callbacks: {
				200: function(response) {
					serviceEnvironmentVariablesContent._refresh(response);
				},
			}
		});
	},

};
