cell({
	id: "systemEmailDomains",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-globe", text: "System email domains" } ),
			body: {
				$components: [
					modalNav({
						up: systemUserManagement._live,
					}),
					button( {
						onclick: systemEmailDomainsNew._live,
						icon: "fa fa-plus",
						text: "New"
					} ),
					hr(),
					dataLoader({
						action: "/system/email_domains",
						render: function(data) {
							return {
								$components: data.map( function( email_domain ) {
									return button({
										text: email_domain,
										onclick: function() { systemEmailDomainsEmailDomain._live(email_domain) },
									});
								}),
							};
						}
					}),
				]
			}
		} );

	}

});
