var $appEnvironmentVariables = {

	$cell: true,
	id: "appEnvironmentVariables",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-question-circle-o", text: "App environment variables" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appEnvironmentVariables._appName ); }
								} ),
								{ $type: "h4", $text: appEnvironmentVariables._appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appEnvironmentVariablesContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [
									appEnvironmentVariables._applicationEnvironmentVariables( data ),
									appEnvironmentVariables._userEnvironmentVariables( data ),
									appEnvironmentVariables._systemEnvironmentVariables( data ),
									appEnvironmentVariables._serviceConsumerEnvironmentVariables( data ),
								];
							},

						}
					]
				}
			}
		);
		this._load();
	},

	_applicationEnvironmentVariables: function( data ) {
		var disableEdit = data.application.variables.every( function ( variable ) {
			return variable.immutable;
		});
		return data.application.variables.length ? {
			$components: [
				{ $type: "label", $text: "Application" },
				{
					class: "clearfix",
					$components: [
						{ $type: "label", $text: "Immutable" },
						dataList( { class: "dl-horizontal", items: data.application.variables.filter( function ( variable ) {
							return variable.immutable
						} ).map( function ( variable ) {
							return { label: variable.name, data: variable.value };
						} ) } ),
						{ $type: "label", $text: "Mutable" },
						dataList( { class: "dl-horizontal", items: data.application.variables.filter( function ( variable ) {
							return !variable.immutable
						} ).map( function ( variable ) {
							return { label: variable.name, data: variable.value };
						} ) } ),
						button( {
							icon: "fa fa-edit",
							text: "Edit",
							class: "pull-right",
							disabled: disableEdit,
							onclick: () => { appEnvironmentVariablesApplication._live( appEnvironmentVariables._appName ) }
						} ),
					]
				},
				{ $type: "hr" },
			]
		} : {};
	},


	_userEnvironmentVariables: function( data ) {
		return {
			$components: [
				{ $type: "label", $text: "User" },
				{
					class: "clearfix",
					$components: [
						dataList( { class: "dl-horizontal", items: data.user.map( function ( variable ) {
							return { label: variable.name, data: variable.value };
						} ) } ),
						button( {
							icon: "fa fa-plus",
							text: "New",
							class: "pull-left",
							onclick: () => { appEnvironmentVariablesUserNew._live( appEnvironmentVariables._appName ) }
						} ),
						button( {
							icon: "fa fa-edit",
							text: "Edit",
							class: "pull-right",
							disabled: data.user.length == 0,
							onclick: () => { appEnvironmentVariablesUserEdit._live( appEnvironmentVariables._appName ) }
						} ),
					]
				},
				{ $type: "hr" },
			]
		};
	},


	_systemEnvironmentVariables: function( data ) {
		return data.system.length ? {
			$components: [
				{ $type: "label", $text: "System" },
				dataList( { class: "dl-horizontal", items: data.system.map( function ( variable ) {
					return { label: variable.name, data: variable.value };
				} ) } ),
				{ $type: "hr" },
			]
		} : {};
	},


	_serviceConsumerEnvironmentVariables: function( data ) {
		var components = [];
		for ( var ownerGroup in data.service_consumers ) {
			components.push( { $type: "label", $text: data.service_consumers[ownerGroup].label } );
			components.push( {
				$components: [
					dataList( { class: "dl-horizontal", items: data.service_consumers[ownerGroup].variables.map( function ( variable ) {
						return { label: variable.name, data: variable.value };
					} ) } ),
				]
			} );
			components.push( { $type: "hr" } );
		};
		components.pop(); // remove last hr
		return {
			$components: components
		};
	},


	_load: function () {
		apiRequest({
			action: "/apps/" + this._appName + "/environment_variables",
			callbacks: {
				200: function(response) {
					appEnvironmentVariablesContent._refresh(response);
				},
			}
		});
	},

};
