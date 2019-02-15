cell({

	id: "appServicesPersistentSubservicesNew",

	_live: function (
		appName, publisherNamespace, typePath, serviceHandle, subPublisherNamespace, subTypePath, subContainerName
  ) {

		this._appName = appName;
		this._publisherNamespace = publisherNamespace;
		this._typePath = typePath;
    this._serviceHandle = serviceHandle
		this._subPublisherNamespace = subPublisherNamespace;
		this._subTypePath = subTypePath;
		this._subContainerName = subContainerName

		this._show();

	},


	_show: function () {

    modal._live ( {
      header: icon ( {
        icon: "fa fa-plus",
        text: "App persistent service new subservice",
      } ),
      body: {
        $components: [
          {
            class: "clearfix",
            $components: [
              // button( {
              //   icon: "fa fa-arrow-up",
              //   wrapperClass: "pull-right",
              //   onclick: function () {
              //     appServicesPersistentSubservicesNew._live(
              //       appServicesPersistentSubservicesNew._appName,
              //       appServicesPersistentSubservicesNew._service_data,
              //       appServicesPersistentSubservicesNew._serviceHandle );
              //    }
              // } ),
              { $type: "h4", $text: appServicesPersistentSubservicesNew._appName },

            ]
          },
          { $type: "hr" },
          { id: "appServicesPersistentSubservicesNewContent", $init: appServicesPersistentSubservicesNew._load },
          {},
        ]
      }
    } )

  },

  _load: function () {

		let appName = this._appName;
		let publisherNamespace = this._publisherNamespace;
		let typePath = this._typePath;
    let serviceHandle = this._serviceHandle
		let subPublisherNamespace = this._subPublisherNamespace;
		let subTypePath = this._subTypePath;
		let subContainerName = this._subContainerName
    apiRequest({

// get blueprint for subservice

// appServicesPersistentSubservicesNew

      action: '/apps/' + appName + '/service_manager/persistent/subservices/new',
			params: {
				service_handle: serviceHandle,
				type_path: typePath,
				publisher_namespace: publisherNamespace,
				sub_type_path: subTypePath,
				sub_publisher_namespace: subPublisherNamespace,
				sub_container_name: subContainerName,
      },
      callbacks: {
        200: function(response, el) {
					let new_service = { service_handle: serviceHandle, ...response }
          appServicesPersistentSubservicesNewContent.$components = [
						{ $type: "h4", $text: new_service.service_label },
	          { $type: "p", $text: new_service.service_description },
						{ $type: "hr" },
	          { $type: "h5", $text: new_service.sub_label },
	          { $type: "p", $text: new_service.sub_description },
						{ $type: "hr" },
            // pp( response ),
						appServicesPersistentSubservicesNew._form( new_service )

            // response["persistent"].map( function() {
            //
            // } ),
            // { $type: "hr" },
            // { $type: "label", $text: "Non-persistent" },
            // pp( response["non_persistent"] ),
            // {
            //   $components: response["non_persistent"].map( function( subservice ) {
            //     debugger
            //     return button( {
            //       text: subservice.title,
            //       onclick: () => {
            //         let appName = appServicesPersistentSubservicesNew._appName
            //         let publisherNamespace = appServicesPersistentSubservicesNew._publisherNamespace
            //         let typePath = appServicesPersistentSubservicesNew._typePath
            //         let serviceHandle = appServicesPersistentSubservicesNew._serviceHandle
            //         let service_data = appServicesPersistentSubservicesNew._service_data
            //         appServicesPersistentSubservicesNew._live(
            //           appName, service_data, serviceHandle, subservice
            //         );
            //       }
            //     } )
            //   } )
            // },
          ]

        }
      }
    });

  },

	_form: function ( new_service ) {

		return form ( {
			components: [
				formField( {
					name: "service_handle",
					type: "hidden",
					value: new_service.service_handle
				} ),
				formField( {
					name: "service_publisher_namespace",
					type: "hidden",
					value: new_service.service_publisher_namespace
				} ),
				formField( {
					name: "service_type_path",
					type: "hidden",
					value: new_service.service_type_path
				} ),
				formField( {
					name: "sub_publisher_namespace",
					type: "hidden",
					value: new_service.sub_publisher_namespace
				} ),
				formField( {
					name: "sub_type_path",
					type: "hidden",
					value: new_service.sub_type_path
				} ),
				{
					$components: new_service.sub_params.map( function( field ) {
						field.name_prefix = "variables";
						return enginesField( field );
					} )
				},
				formCancel ( {
					onclick: function () {
						appServicesPersistentSubservicesNewType._live(
							appServicesPersistentSubservicesNew._appName,
							appServicesPersistentSubservicesNew._publisherNamespace,
							appServicesPersistentSubservicesNew._typePath,
							appServicesPersistentSubservicesNew._serviceHandle );
					 }
				 } ),
				formSubmit( new_service.sub_params.length > 0 ? {} : { init: function(button) { button.click(); } } ),
			],
			action: "/apps/" + this._appName + "/service_manager/persistent/subservices/",
			method: 'POST',
			callbacks: {
				200: function() {
					// alert(`Successfully added subservice. Now open ${appServicesPersistentSubservicesNew._appName}`)
					// debugger
					appServicesPersistent._live(
						appServicesPersistentSubservicesNew._appName,
						appServicesPersistentSubservicesNew._publisherNamespace,
						appServicesPersistentSubservicesNew._typePath,
						appServicesPersistentSubservicesNew._serviceHandle
					);
				},
			}
		});
	}


})
