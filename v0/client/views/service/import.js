cell({

  id: "serviceImport",

  _live: function(serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-upload", text: "Service import data" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceData._live( serviceName ) }
					}),
					hr(),

          {
            $type: 'div',
            $components: [
              {
                $type: 'div',
                class: 'dropzone',
                $init: function() {
                  Dropzone.autoDiscover = false
                  this.$dropzone = new Dropzone( this, {
                    url: "/services/" + serviceName + "/data/import/chunked",
                    method: 'post',
                    maxFilesize: Number.MAX_SAFE_INTEGER,
                    uploadMultiple: false,
                    chunking: true,
                    forceChunking: true,
                    chunkSize: 1000000, //1 MB Chunks
                    maxFiles: 1,
                    createImageThumbnails: false,
                    success: () => {
                      this.$text = `Successfully imported data for ${ serviceName }.`
                    },
                    error: (e,message) => {
                      this.$text = `Successfully imported data for ${ serviceName }.`
                      alert(`Failed to import data for ${ serviceName }.`)
                      serviceData._live( serviceName )
                    }
                  } )
                },
              }
            ]
          },

          // form({
          //   components: [
          //     formField( {
          //       name: "data[file]",
          //       label: "Data file (.gzip)",
          //       type: "file",
          //       required: true,
          //     } ),
          //     formCancel ( {
          //       onclick: () => serviceData._live( serviceName )
      		// 		} ),
      		// 		formSubmit(),
      		// 	],
          //   action: "/services/" + serviceName + "/data/import",
          //   enctype: "multipart/form-data",
      		// 	method: 'PUT',
      		// 	callbacks: {
      		// 		200: function() {
      		// 			serviceData._live( serviceName );
      		// 		},
      		// 	},
          // }),
        ]
      },
    });

  },

});
