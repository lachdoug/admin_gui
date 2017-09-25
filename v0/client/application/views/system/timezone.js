var $systemTimezone = {
	
	$cell: true,
	id: "systemTimezone",
	
	
	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-clock-o", text: "Timezone" } ),
				body: {
					$components: [
						{
							id: "systemTimezoneForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ) 
							],
							_refresh: function (timezoneData) {
								this.$components = [ systemTimezone._form(timezoneData) ];
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
					systemTimezoneForm._refresh(response);
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
					id: "systemTimezoneField_timezone", 
					label: "Country",
					value: timezoneData.timezone
				} ),
				formCancel ( { onclick: "systemControlPanel._live();" } ),
				formSubmit(),
//				pp( timezoneData )
			],
			action: "/system/timezone",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemControlPanel._live();
				},
			}
		});
		
	},
	
};
