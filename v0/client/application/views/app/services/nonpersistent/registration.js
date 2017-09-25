var $appServicesNonpersistentRegistration = {

	$cell: true,
	id: "appServicesNonpersistentRegistration",

	_appName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,
	_data: null,


	_live: function( appName, publisherNamespace, typePath, serviceHandle, data ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-registered",
					text: "App non-persistent service registration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appServicesNonpersistent._live( appName, publisherNamespace, typePath, serviceHandle ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: appServicesNonpersistentRegistration._data.label },
						{ $type: "p", $text: appServicesNonpersistentRegistration._data.description },
						{ $type: "hr" },
						button( {
							text: "Register",
							onclick: function () { appServicesNonpersistentRegistration._registration( "PUT" ) }
						} ),
						button( {
							text: "Deregister",
							onclick: function () { appServicesNonpersistentRegistration._registration( "DELETE" ) }
						} ),
						button( {
							text: "Reregister",
							onclick: function () { appServicesNonpersistentRegistration._registration( "PATCH" ) }
						} ),
					]
				}
			}
		);

	},

	_registration: function( method ) {

		var appName = this._appName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		var queryString =
			"publisher_namespace=" + encodeURIComponent( publisherNamespace ) +
			"&type_path=" + encodeURIComponent( typePath ) +
			"&service_handle=" + encodeURIComponent( serviceHandle );

		apiRequest({
			action: "/apps/" + appName +
			"/service_manager/nonpersistent/registration/?" + queryString,
			method: method,
			callbacks: {
				200: function() {
					appServicesNonpersistent._live( appName, publisherNamespace, typePath, serviceHandle );
				}
			},
		});

	},

};
