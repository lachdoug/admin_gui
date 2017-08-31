var $systemLocale = {
	
	$cell: true,
	id: "systemLocale",
	
	
	_live: function() {
		$$("#modal")._live(
			{
				header: icon( { icon: "fa fa-map-marker", text: "Locale" } ),
				body: {
					$components: [
						{
							id: "systemLocaleForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ) 
							],
							_refresh: function (localeData) {
								this.$components = [ $$("#systemLocale")._form(localeData) ];
							},
						}
					]
				}
			}
		);
		this._loadLocale();
	},
	
	_loadLocale: function () {
		apiRequest({
			action: "/system/locale",
			callbacks: {
				200: function(response) {
					$$("#systemLocaleForm")._refresh(response);
				},
			}
		});
	},

	
	_form: function (localeData) {
		return form ( {
			components: [
				formField( {
					type: "language",
					name: "form[lang_code]", 
					id: "systemLocaleField_lang_code", 
					label: "Language", 
					value: localeData.lang_code
				} ),
				formField( {
					type: "country",
					name: "form[country_code]", 
					id: "systemLocaleField_country_code", 
					label: "Country",
					value: localeData.country_code
				} ),
				formCancel ( { onclick: "$$('#systemControlPanel')._live();" } ),
				formSubmit(),
			],
			action: "/system/locale",
			method: "PUT",
			callbacks: {
				200: function(response) {
					$$("#systemControlPanel")._live();
				},
			}
		});
		
	},
	
};
