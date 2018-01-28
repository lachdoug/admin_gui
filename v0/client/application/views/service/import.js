cell({

  id: "serviceImport",

  _live: function(serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-upload", text: "Service import data" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceControlPanel._live( serviceName ); }
					}),
					hr(),
          form({
            components: [
              formField( {
                name: "data[file]",
                label: "Data file (.gzip)",
                type: "file",
                required: true,
              } ),
              formCancel ( {
                onclick: () => serviceData._live( serviceName )
      				} ),
      				formSubmit(),
      			],
            action: "/services/" + serviceName + "/data/import",
            enctype: "multipart/form-data",
      			method: 'PUT',
      			callbacks: {
      				200: function() {
      					serviceData._live( serviceName );
      				},
      			},
          }),
        ]
      },
    });

  },

});
