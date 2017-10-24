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
									// serviceEnvironmentVariables._serviceEnvironmentVariables( data ),
									// serviceEnvironmentVariables._userEnvironmentVariables( data ),
									// serviceEnvironmentVariables._systemEnvironmentVariables( data ),
									// serviceEnvironmentVariables._serviceConsumerEnvironmentVariables( data ),
									pp( data ),
								];
							},

						}
					]
				}
			}
		);
		this._load();
	},

  	// _serviceEnvironmentVariables: function( data ) {
		// var disableEdit = data.service.variables.every( function ( variable ) {
		// 	return variable.immutable;
		// });
		// return data.service.variables.length ? {
		// 	$components: [
		// 		{ $type: "label", $text: "Service" },
		// 		{
		// 			class: "clearfix",
		// 			$components: [
		// 				dataList( { class: "dl-horizontal", items: data.service.variables.map( function ( variable ) {
		// 					return { label: ( variable.input || {} ).label || variable.name, data: variable.value };
		// 				} ) } ),
		// 				button( {
		// 					icon: "fa fa-edit",
		// 					text: "Edit",
		// 					class: "pull-right",
		// 					disabled: disableEdit,
		// 					onclick: () => { serviceEnvironmentVariablesService._live( serviceEnvironmentVariables._serviceName ) }
		// 				} ),
		// 			]
		// 		},
		// 		{ $type: "hr" },
		// 	]
		// } : {};
		// },


	// _userEnvironmentVariables: function( data ) {
	// 	// var disableEdit = data.user.every( function ( variable ) {
	// 	// 	return variable.immutable;
	// 	// });
	// 	return {
	// 		$components: [
	// 			{ $type: "label", $text: "User" },
	// 			{
	// 				class: "clearfix",
	// 				$components: [
	// 					dataList( { class: "dl-horizontal", items: data.user.map( function ( variable ) {
	// 						return { label: ( variable.input || {} ).label || variable.name, data: variable.value };
	// 					} ) } ),
	// 					button( {
	// 						icon: "fa fa-plus",
	// 						text: "New",
	// 						class: "pull-left",
	// 						onclick: () => { serviceEnvironmentVariablesUserNew._live( serviceEnvironmentVariables._serviceName ) }
	// 					} ),
	// 					button( {
	// 						icon: "fa fa-edit",
	// 						text: "Edit",
	// 						class: "pull-right",
	// 						disabled: !data.user.length,
	// 						onclick: () => { serviceEnvironmentVariablesUserEdit._live( serviceEnvironmentVariables._serviceName ) }
	// 					} ),
	// 				]
	// 			},
	// 			{ $type: "hr" },
	// 		]
	// 	};
	// },
	//
	//
	// _systemEnvironmentVariables: function( data ) {
	// 	return data.system.length ? {
	// 		$components: [
	// 			{ $type: "label", $text: "System" },
	// 			dataList( { class: "dl-horizontal", items: data.system.map( function ( variable ) {
	// 				return { label: variable.label || variable.name, data: variable.value };
	// 			} ) } ),
	// 			{ $type: "hr" },
	// 		]
	// 	} : {};
	// },
	//
	//
	// _serviceConsumerEnvironmentVariables: function( data ) {
	// 	var components = [];
	// 	for ( var ownerGroup in data.service_consumers ) {
	// 		// var disableEdit = data.service_consumers[ownerGroup].variables.every( function ( variable ) {
	// 		// 	return variable.immutable;
	// 		// });
	// 		components.push( { $type: "label", $text: data.service_consumers[ownerGroup].label } );
	// 		components.push( {
	// 		// 	class: "clearfix",
	// 			$components: [
	// 				dataList( { class: "dl-horizontal", items: data.service_consumers[ownerGroup].variables.map( function ( variable ) {
	// 					return { label: ( variable.input || {} ).label || variable.label || variable.name, data: variable.value }; // variable.label to support legacy service definition
	// 				} ) } ),
	// 		// 		button( {
	// 		// 			icon: "fa fa-edit",
	// 		// 			text: "Edit",
	// 		// 			class: "pull-right",
	// 		// 			disabled: disableEdit,
	// 		// 			onclick: () => { serviceEnvironmentVariablesServiceConsumer._live( serviceEnvironmentVariables._serviceName, ownerGroup ) }
	// 		// 		} )
	// 			]
	// 		} );
	// 		components.push( { $type: "hr" } );
	// 	};
	// 	components.pop(); // remove last hr
	// 	return {
	// 		$components: components
	// 	};
	// },


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
