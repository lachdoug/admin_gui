cell({
	id: "systemEmailDomainsEmailDomain",

	_live: function (email_domain) {

		modal._live ( {
			header: icon( { icon: "fa fa-globe", text: "System email domain" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmailDomains._live,
						content: { $type: "h4", $text: email_domain }
					}),
					hr(),
					dataLoader({
						action: "/system/email_domains/email_domain/",
						// ?email_domain=" + encodeURIComponent( email_domain )
						params: {
							email_domain: email_domain,
						},
						// render: function(data) {
						// 	return {
						// 		$components: data.map( function( email_domain ) {
						// 			return button({
						// 				text: email_domain,
						// 				onclick: function() { systemUsersGroup._live(email_domain) },
						// 			});
						// 		}),
						// 	};
						// }
					}),
				]
			}
		} );

	}

});
