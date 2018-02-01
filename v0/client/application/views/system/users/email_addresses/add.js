cell({

	id: 'systemUsersEmailAddressesAdd',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System user add email alias" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/users/user/" + user_uid + "/new_email_address",
						render: function(data) {

							return form({
								components: [
									formField( {
										name: "data[email_address][local_part]",
										label: "Local part (before the @)",
										required: true,
									} ),
									formField( {
										type: "select",
										name: "data[email_address][domain]",
										label: "Domain",
										value: data.default,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" }) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user_uid + "/email_addresses",
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" });
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
