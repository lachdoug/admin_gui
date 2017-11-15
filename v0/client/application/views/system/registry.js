var $systemRegistry = {

	$cell: true,
	id: "systemRegistry",


	_live: function() {
		modal._live(
			{
				dialogClass: "modal-lg",
				header: icon( { icon: "fa fa-arrows", text: "System registry" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemControlPanel._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
								button( { onclick: systemRegistry._live,
									icon: "fa fa-repeat", text: "Refresh" }
								),
							]
						},
						{
							id: "systemRegistryTree",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (registryData) {
								this.$components = [ tree(registryData) ];
							},
						}
					]
				}
			}
		);
		this._loadRegistry();
	},

	_loadRegistry: function () {
		apiRequest({
			action: "/system/registry",
			callbacks: {
				200: function(response) {
					systemRegistryTree._refresh(response);
				},
			}
		});
	},

};
