cell({
	id: "systemEmail",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System email" } ),
			body: {
				$components: [
					modalNav({
						up: systemControlPanel._live,
					}),
					dataLoader({
						action: "/system/email_domains",
						render: function(data) {
							return data.default ? {
								$components: [
									button( {
										wrapperClass: "pull-right",
										onclick: systemEmailDistributionLists._live,
										icon: "fa fa-share-square-o",
										text: "Distribution lists"
									} ),
									button( {
										onclick: systemEmailAddresses._live,
										icon: "fa fa-envelope-square",
										text: "Addresses"
									} ),
									hr(),
									{ $type: "label", $text: "Domains"},
									{
										class: "clearfix",
										$components: [
											{
												class: "pull-left",
												$components: [
													labelText("Default", data.default),
												]
											},
											button( {
												wrapperClass: "pull-right",
												onclick: systemEmailDomainsDefault._live,
												icon: "fa fa-star-o",
												text: "Set default"
											} ),
										]
									},
									{
										class: "clearfix",
										$components: [
											button( {
												wrapperClass: "pull-left",
												onclick: systemEmailDomainsNew._live,
												icon: "fa fa-plus-square-o",
												text: "Add"
											} ),
											button( {
												wrapperClass: "pull-right",
												onclick: systemEmailDomainsDelete._live,
												icon: "fa fa-minus-square-o",
												text: "Remove"
											} ),
										]
									},
									{
										$type: "ul",
										$components: data.domains.map( function( domain ) {
											return { $type: "li", $text: domain };
										})
									},

								],
							} : {
								$components: [
									button( {
										onclick: systemEmailSetupEmailDomain._live,
										icon: "fa fa-pencil-square",
										text: "Setup email domain"
									} )
								]
							};
						}
					}),
				]
			}
		} );

	}

});
