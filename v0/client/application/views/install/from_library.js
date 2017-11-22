var $installFromLibrary = {

	$cell: true,
	id: "installFromLibrary",


	_live: function () {
		modal._live ( {
			dialogClass: "modal-lg",
			header: icon({icon: "fa fa-plus", text: "Install app"}),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemMenu._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} )
						]
					},
					{
						class: "row",
						style: "text-align: center;",
						$components: [
							{ id: "installFromLibraryAppList",
							 	$components: [
									icon({icon: "fa fa-spinner fa-spin", text: "Loading" })
								]
							}
						]
					}
				]
			}
		});
		this._loadApps();

	},


	_loadApps: function() {

		apiRequest({
			action: '/library/0',
			callbacks: {
				200: function(response) {
					installFromLibrary._renderApps ( response.apps );
				},
				405: function (response) {
					alert( response.error.message );
					systemMenu._live();
				}
			}
		});

	},


	_renderApps: function(appsData) {

		installFromLibraryAppList.$components = [
			{
				$type: "input",
				class: "search form-control",
				$init: function() {
					new List('installFromLibraryAppList', { valueNames: ['searchListItem'] });
				},
				placeholder: "Search",
				style: "width: 200px; margin-bottom: 10px; display: inline-block;",
			},
			{
				$type: "ul",
				class: "list",
				style: "list-style: none; margin-left: -30px;",
				$components: appsData.map(
					function (appData) {
						return {
							$type: "li",
							class: "col-xs-6 col-sm-3 col-md-2 col-lg-2",
							$components: [
								{
									$type: "button",
									style: "height: 128px; width: 100%; overflow: hidden; text-align: center; padding: 5px; white-space: normal; background-color: transparent; line-height: 128px;",
									class: "btn",
									title: "Install " + appData.label,
									$components: [
										{
											style: "height: 128px; line-height: 64px",
											$components: [
												{
													style: "height: 64px; width: 64px; display: inline-block; padding-bottom: 6px;",
													$components: [
														{
															$type: "img",
															src: appData.icon_url,
															style: "max-height: 64px; max-width: 64px;"
														}
													]
												},
												{
													style: "line-height: 1; padding-top: 5px;",
													$components: [
														{ $type: "span", class: "searchListItem", $text: appData.label }
													]
												}
											]
										}
									],
									onclick: function () {
										installNewApp._live( appData.blueprint_url , function () { installFromLibrary._live() } )
									}
								}
							]
						};
					}
				)
			},
		];
		$("#modal input.search").focus();

	},


	// _failedToLoad: function (error_message) {
	//
	// 	installFromLibraryAppList.$components = [
	// 		{ $text: "Failed to load apps from library."},
	// 		{ $type: "br" },
	// 		{ $text: error_message }
	// 	];
	//
	// },

};
