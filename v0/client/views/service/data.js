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
          button( {
            wrapperClass: "pull-left",
            icon: "fa fa-download",
            text: "Export",
            onclick: function () {
              apiRequest({
          			action: "/services/" + serviceName + "/data/export",
          		});
            },
          } ),
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
