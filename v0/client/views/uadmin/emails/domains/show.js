cell({
	id: "systemEmailDomainsEmailDomain",

	_live: function (email_domain) {

		modal._live ( {
			header: icon( { icon: "fa fa-globe", text: "System email domain" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
						content: { $type: "h4", $text: email_domain }
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email_domains/email_domain/",
						params: {
							email_domain: email_domain,
						},
						render: function(data) {
							return {
								$components: [
									data.default ? {} : button({
										icon: "fa fa-star-o",
										text: "Set as default",
										onclick: function() {
											apiRequest({
												action: "/uadmin/email_domains/set_default",
												data: {
													email_domain: email_domain
												},
												callbacks: {
													200: function () {
														systemEmailDomainsEmailDomain._live(email_domain);
													}
												}
											})
										},
									}),
									button({
										icon: "fa fa-trash-o",
										text: "Delete",
										onclick: function() { systemUsersGroup._live(email_domain) },
									})
								],
							};
						}
					}),
				]
			}
		} );

	}

});
