cell({

	id: "appServicesPersistentSubservicesNewSubservice",

	_live: function (
    appName, serviceData, serviceHandle, subservice
  ) {

		this._appName = appName;
    this._service_data = serviceData
    this._serviceHandle = serviceHandle
    this._subservice = subservice

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
              button( {
                icon: "fa fa-arrow-up",
                wrapperClass: "pull-right",
                onclick: function () {
                  appServicesPersistent._live(
                    appServicesPersistentSubservicesNewSubservice._appName,
                    appServicesPersistentSubservicesNewSubservice._service_data.publisherNamespace,
                    appServicesPersistentSubservicesNewSubservice._service_data.typePath,
                    appServicesPersistentSubservicesNewSubservice._serviceHandle );
                 }
              } ),
              { $type: "h4", $text: appServicesPersistentSubservicesNewSubservice._appName },

            ]
          },
          { $type: "hr" },
          { $type: "h4", $text: appServicesPersistentSubservicesNewSubservice._service_data.label },
          { $type: "p", $text: appServicesPersistentSubservicesNewSubservice._service_data.description },
					{ $type: "hr" },
					{ $type: "h4", $text: appServicesPersistentSubservicesNewSubservice._subservice.service_container },
          { $type: "h5", $text: appServicesPersistentSubservicesNewSubservice._subservice.title },
          { $type: "p", $text: appServicesPersistentSubservicesNewSubservice._subservice.description },
					{ $type: "hr" },

          { id: "appServicesPersistentSubservicesNewSubserviceContent", $init: appServicesPersistentSubservicesNewSubservice._load },
          {},
        ]
      }
    } )

  },

  _load: function () {


		let subserviceName = this._subservice.service_container

    apiRequest({

// get blueprint for subservice

// appServicesPersistentSubservicesNewSubservice

      action: "/services/" + subserviceName + "/service_definition",
			params: {
        type_path: this._typePath,
      },
      callbacks: {
        200: function(response, el) {

          appServicesPersistentSubservicesNewSubserviceContent.$components = [
            // { $type: "label", $text: "Persistent" },
            pp( response ),
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
            //         appServicesPersistentSubservicesNewSubservice._live(
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

})
