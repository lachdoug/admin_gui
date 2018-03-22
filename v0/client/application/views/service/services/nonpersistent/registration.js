var $serviceServicesNonpersistentRegistration = {

	$cell: true,
	id: "serviceServicesNonpersistentRegistration",

	// _serviceName: null,
	// _publisherNamespace: null,
	// _typePath: null,
	// _serviceHandle: null,
	// _data: null,


	_live: function( serviceName, publisherNamespace, typePath, serviceHandle, data ) {

		this._serviceName = serviceName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._data = data;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-tag",
					text: "Service non-persistent service registration",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceServicesNonpersistent._live( serviceName, publisherNamespace, typePath, serviceHandle ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: serviceServicesNonpersistentRegistration._data.label },
						{ $type: "p", $text: serviceServicesNonpersistentRegistration._data.description },
						{ $type: "hr" },
						button( {
							text: "Register",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "PUT" ) }
						} ),
						button( {
							text: "Deregister",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "DELETE" ) }
						} ),
						button( {
							text: "Reregister",
							onclick: function () { serviceServicesNonpersistentRegistration._registration( "PATCH" ) }
						} ),
					]
				}
			}
		);

	},

	_registration: function( method ) {

		var serviceName = this._serviceName;
		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/services/" + serviceName + "/service_manager/nonpersistent/registration/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			method: method,
			callbacks: {
				200: function() {
					serviceServicesNonpersistent._live( serviceName, publisherNamespace, typePath, serviceHandle );
				}
			},
		});

	},

};
