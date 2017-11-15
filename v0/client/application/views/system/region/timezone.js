var $systemRegionTimezone = {

	$cell: true,
	id: "systemRegionTimezone",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-clock-o", text: "System timezone edit" } ),
				body: {
					$components: [
						{
							id: "systemRegionTimezoneForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (timezoneData) {
								this.$components = [ systemRegionTimezone._form(timezoneData) ];
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
			action: "/system/timezone",
			callbacks: {
				200: function(response) {
					systemRegionTimezoneForm._refresh(response);
				},
			}
		});
	},


	_form: function (timezoneData) {
		return form ( {
			components: [
				formField( {
					type: "timezone",
					name: "data[timezone]",
					// id: "systemRegionTimezoneField_timezone",
					label: "Country",
					value: timezoneData.timezone
				} ),
				formCancel ( { onclick: systemRegion._live } ),
				formSubmit(),
//				pp( timezoneData )
			],
			action: "/system/timezone",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemRegion._live();
				},
			}
		});

	},

};
