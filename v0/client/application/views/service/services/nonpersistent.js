var $serviceServicesNonpersistent = {

	$cell: true,
	id: "serviceServicesNonpersistent",

	_serviceName: null,
	_publisherNamespace: null,
	_typePath: null,
	_serviceHandle: null,


	_live: function( serviceName, publisherNamespace, typePath, serviceHandle ) {

		this._serviceName = serviceName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
		this._serviceHandle = serviceHandle;
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		modal._live (
			{
				// dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service non-persistent service",
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceServices._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{
							id: "serviceServicesNonpersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: serviceServicesNonpersistent._load(),

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {
								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									button( {
										icon: "fa fa-tag",
										text: "Registration",
										onclick: function () { serviceServicesNonpersistentRegistration._live(
											serviceServicesNonpersistent._serviceName,
											serviceServicesNonpersistent._publisherNamespace,
											serviceServicesNonpersistent._typePath,
											serviceServicesNonpersistent._serviceHandle,
											this._data ); }
									} ),
									{ $type: "hr" },
									dataList( { class: "dl-horizontal", items: ( this._data.params.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) ) } ),

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
			action: "/services/" + this._serviceName + "/service_manager/services/?" + queryString,
			callbacks: {
				200: function(response) {
					serviceServicesNonpersistentContent._refresh( response );
				}
			}
		});

	},

	// _registration: function( method ) {
	//
	// 	var queryString =
	// 		"publisher_namespace=" + encodeURIComponent( this._publisherNamespace ) +
	// 		"&type_path=" + encodeURIComponent( this._typePath ) +
	// 		"&service_handle=" + encodeURIComponent( this._serviceHandle );
	//
	// 	apiRequest({
	// 		action: "/services/" + this._serviceName +
	// 		"/service_manager/nonpersistent/registration/?" + queryString,
	// 		method: method,
	// 		callbacks: {
	// 			200: function() {
	// 				serviceServicesNonpersistent._show();
	// 			}
	// 		},
	// 	});
	//
	// },

};
