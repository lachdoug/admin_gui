cell({

  id: "serviceData",

  _live: function(serviceName) {

		modal._live({
			header: icon( { icon: "fa fa-database", text: "Service data" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: serviceName },
						up: function () { serviceControlPanel._live( serviceName ); }
					}),
					hr(),
          {
            $type: "a",
            class: "btn btn-lg btn-custom pull-left-md",
            $components: [
              icon( {
                icon: "fa fa-download",
                text: "Export"
              } )
            ],
            href: "/services/" + serviceName + "/data/export",
            download: `Engines_${ serviceName
              }.data`
          },
          button( {
            wrapperClass: "pull-right",
            icon: "fa fa-upload",
            text: "Import",
            onclick: function () { serviceImport._live(serviceName); },
          } ),
        ]
      },
    });

  },

});
