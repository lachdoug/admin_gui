var $systemRegion = {

	$cell: true,
	id: "systemRegion",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-map-marker", text: "System region" } ),
				body: {
					$components: [
            {
							class: "clearfix",
							$components: [
								button( {
									onclick: "systemControlPanel._live()",
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							id: "systemRegionLocaleContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [
                  systemRegion._locale(localeData),
                  button({
                    icon: "fa fa-edit",
                    text: "Edit",
                    wrapperClass: "clearfix",
                    class: "pull-right-md",
                    onclick: systemRegionLocale._live
                  })
                ];
							},
						},
            { $type: "hr" },
            {
							id: "systemRegionTimezoneContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (localeData) {
								this.$components = [
                  systemRegion._timezone(localeData),
                  button({
                    icon: "fa fa-edit",
                    text: "Edit",
                    wrapperClass: "clearfix",
                    class: "pull-right-md",
                    onclick: systemRegionTimezone._live
                  })
                ];
							},
						},

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
          systemRegionTimezoneContent._refresh(response);
        },
      }
    });

		apiRequest({
			action: "/system/locale",
			callbacks: {
				200: function(response) {
					systemRegionLocaleContent._refresh(response);
				},
			}
		});

	},


  _locale: function( data ) {
		return dataList ( {
      class: "dl-horizontal",
			items: [
        { label: "Country", data: data.country_code },
        { label: "Language", data: data.lang_code },
			]
    } );
  },

  _timezone: function( data ) {
		return dataList ( {
      class: "dl-horizontal",
			items: [
        { label: "Timezone", data: data.timezone },
			]
    } );
	},

};
