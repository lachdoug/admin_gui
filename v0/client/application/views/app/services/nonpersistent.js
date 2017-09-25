var $appServicesNonpersistent = {

	$cell: true,
	id: "appServicesNonpersistent",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-compass",
					text: "App non-persistent service",
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
						{
							id: "appServicesNonpersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: appServicesNonpersistent._load(),

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								var immutableParams = this._data.params.filter( function(param) { return param.immutable } );
								var mutableParams = this._data.params.filter( function(param) { return param.immutable != true } );
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									button( {
										icon: "fa fa-registered",
										text: "Registration",
										// wrapperClass: "clearfix",
										// class: "pull-right",
										onclick: function () { appServicesNonpersistentRegistration._live(
											appServicesNonpersistent._appName,
											appServicesNonpersistent._publisherNamespace,
											appServicesNonpersistent._typePath,
											appServicesNonpersistent._serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									{ $type: "label", $text: "Immutable" },
									dataList( { class: "dl-horizontal", items: ( immutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) || [] ) } ),
									{ $type: "label", $text: "Mutable" },
									dataList( { class: "dl-horizontal", items: ( mutableParams.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) || [] ) } ),
									button( {
										icon: "fa fa-edit",
										wrapperClass: "clearfix",
										class: "pull-right-md",
										text: "Edit",
										onclick: () => { appServicesNonpersistentEdit._live(
											appServicesNonpersistent._appName,
											appServicesNonpersistent._publisherNamespace,
											appServicesNonpersistent._typePath,
											appServicesNonpersistent._serviceHandle,
											this._data ); }
									} ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var queryString =
			"publisher_namespace=" + encodeURIComponent( this._publisherNamespace ) +
			"&type_path=" + encodeURIComponent( this._typePath ) +
			"&service_handle=" + encodeURIComponent( this._serviceHandle );

		apiRequest({
			action: "/apps/" + this._appName + "/service_manager/services/?" + queryString,
			callbacks: {
				200: function(response) {
					appServicesNonpersistentContent._refresh( response );
				}
			}
		});

	},

	_registration: function( method ) {

		var queryString =
			"publisher_namespace=" + encodeURIComponent( this._publisherNamespace ) +
			"&type_path=" + encodeURIComponent( this._typePath ) +
			"&service_handle=" + encodeURIComponent( this._serviceHandle );

		apiRequest({
			action: "/apps/" + this._appName +
			"/service_manager/nonpersistent/registration/?" + queryString,
			method: method,
			callbacks: {
				200: function() {
					appServicesNonpersistent._show();
				}
			},
		});

	},

};
