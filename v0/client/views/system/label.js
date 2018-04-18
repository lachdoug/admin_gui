cell({

	id: 'systemLabel',

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-window-maximize", text: "System label" } ),
			body: {
				$components: [
					dataLoader({
						action: "/system/label",
						render: function(data) {
							return form({
								components: [
                  formField( {
										// type: "select",
										name: "label[text]",
										label: "Display text",
                    value: data.text
									} ),
                  {
                    class: "row",
                    $components: [
                      formField( {
                        wrapperClass: "col-xs-4",
    										type: "color",
    										name: "label[color]",
    										label: "Text",
                        value: data.color
    									} ),
                      formField( {
                        wrapperClass: "col-xs-8",
    										type: "color",
    										name: "label[background_color]",
    										label: "Background",
                        value: data.background_color || "#ffffff"
    									} )
                    ]
                  },
									formCancel ( { onclick: systemControlPanel._live } ),
									formSubmit(),
								],
								action: "/system/label",
								method: "PUT",
								callbacks: {
									200: function () {
                    system._live();
                    systemControlPanel._live();
                  },
								}
							});

						}
					}),
				]
			}
		} );
	},

});
