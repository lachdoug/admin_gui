var $systemDefaultSite = {

	$cell: true,
	id: "systemDefaultSite",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-home", text: "System default site" } ),
				body: {
					$components: [
						{
							id: "systemDefaultSiteForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemDefaultSite._form( data ) ];
							},
						}
					]
				}
			}
		);
		this._load();
	},

	_load: function () {
		apiRequest({
			action: "/system/default_site",
			callbacks: {
				200: function(response) {
					systemDefaultSiteForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					name: "data[default_site]",
					label: "Default site",
					hint: "Enter a host name (e.g: www.engines.org )",
					value: data.default_site
				} ),
				formCancel ( { onclick: "systemControlPanel._live();" } ),
				formSubmit(),
			],
			action: "/system/default_site",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});

	},

};
