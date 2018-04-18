cell({
	id: "systemEmailAddresses",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System email addresses" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/email_addresses",
						render: function(data) {
							return {
								id: "systemEmailAddressesSearchList",
								$components: [
									{
										class: "text-center",
										$components: [
											{
												$type: "input",
												class: "search form-control",
												$init: function() {
													new List('systemEmailAddressesSearchList', { valueNames: ['searchListItem'] });
												},
												placeholder: "Search",
												style: "width: 200px; margin-bottom: 10px; display: inline-block;",
											},
										]
									},
									{
										$type: "ul",
										class: "list",
										style: "list-style: none; margin-left: -30px;",
										$components: data.map( function( email_address ) {
											switch(email_address.source_type) {
												case 'mailbox': return button({
													class: "searchListItem",
													text: email_address.email_address + " (mailbox)",
													onclick: function() { systemUsersUser._live(email_address.user_uid) },
												});
												case 'alias': return button({
													class: "searchListItem",
													text: email_address.email_address + " (alias)",
													onclick: function() { systemUsersUser._live(email_address.user_uid) },
												});
												case 'distribution_group': return button({
													class: "searchListItem",
													text: email_address.email_address + " (distribution group)",
													onclick: function() { systemEmailDistributionGroup._live(email_address.distribution_group_name) },
												});
											}
										}),
									}
								]
							};
						},
					}),
				]
			}
		} );

	}

});
