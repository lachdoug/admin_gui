cell({

	id: "serviceServicesPersistent",

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
				header: icon ( {
					icon: "fa fa-compass",
					text: "Service persistent service",
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
							id: "serviceServicesPersistentContent",
							_data: null,

							$components: [
								icon ( { icon: "fa fa-spinner fa-spin", text: "Loading" } )
							],

							$init: serviceServicesPersistent._load,

							_refresh: function (data) {
								this._data = data
							},

							$update: function () {

								this.$components = [
									{ $type: "h4", $text: this._data.label },
									{ $type: "p", $text: this._data.description },
									{ $type: "hr" },
									dataList( { class: "dl-horizontal", items: this._data.params.map( function( param ) {
										return { label: ( dig( param, "input", "label" ) || param.name ), data: param.value };
									} ) } ),

								];
							},

						},
					]
				}
			}
		);

	},


	_load: function () {

		var publisherNamespace = this._publisherNamespace;
		var typePath = this._typePath;
		var serviceHandle = this._serviceHandle;

		apiRequest({
			action: "/services/" + this._serviceName + "/service_manager/services/",
			params: {
				publisher_namespace: publisherNamespace,
				type_path: typePath,
				service_handle: serviceHandle
			},
			callbacks: {
				200: function(response) {
					serviceServicesPersistentContent._refresh( response );
				}
			}
		});

	},

});
