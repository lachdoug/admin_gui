cell({

	id: "systemReservedNames",

	_live: function () {
		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-ban",
					text: "System reserved names",
				} ),
				body: {
					$components: [
						modalNav({
							up: systemDiagnostics._live
						}),
						hr(),
						dataLoader({
							action: "/system/reserved_names",
						}),

					]
				}
			}
		);

	},

});
