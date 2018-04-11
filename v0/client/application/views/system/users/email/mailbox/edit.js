cell({

	id: 'systemUserEmailMailboxEdit',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user edit mailbox" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/users/accounts/email/edit",
						params: { user_uid: user_uid },
						render: function(data) {

							return data.email_domains.length == 0 ? {
								$components: [
									{ $type: "i", $text: "The system does not have an email domain." },
									button({
										wrapperClass: "pull-right",
										text: "OK",
										icon: "fa fa-check",
										onclick: function() { systemUserEmail._live(user_uid) }
									})
								] } : form({
								components: [
									formField( {
										type: "select",
										name: "email[domain_name]",
										label: "Domain",
										value: data.mailbox_domain,
										collection: data.email_domains,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailArea" }); } } ),
									formSubmit(),
								],
								action: "/system/users/accounts/email",
								params: { user_uid: user_uid },
								method: "PUT",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailArea" });
									},
								}
							});

						}
					}),
				]
			}
		} );
	},

});
