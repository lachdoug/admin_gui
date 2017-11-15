var $systemRegionLocale = {

	$cell: true,
	id: "systemRegionLocale",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-comment-o", text: "System locale edit" } ),
				body: {
					$components: [
						{
							id: "systemRegionLocaleForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [ systemRegionLocale._form(localeData) ];
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
					systemRegionLocaleForm._refresh(response);
				},
			}
		});
	},


	_form: function (localeData) {
		return form ( {
			components: [
				formField( {
					type: "country",
					name: "data[country_code]",
					// id: "systemRegionLocaleField_country_code",
					label: "Country",
					value: localeData.country_code
				} ),
				formField( {
					type: "language",
					name: "data[lang_code]",
					// id: "systemRegionLocaleField_lang_code",
					label: "Language",
					value: localeData.lang_code
				} ),
				formCancel ( { onclick: systemRegion._live } ),
				formSubmit(),
			],
			action: "/system/locale",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemRegion._live();
				},
			}
		});

	},

};
