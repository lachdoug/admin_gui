cell({

	id: 'systemUsersEmailAddressesAdd',

	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope-square", text: "System user add email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user.name },
					}),
					hr(),
					dataLoader({
						action: "/system/users/user/" + user.uid + "/new_email_address",
						render: function(data) {

							return form({
								components: [
									formField( {
										name: "data[email_address][local_part]",
										label: "Local part (before the @)",
									} ),
									formField( {
										type: "select",
										name: "data[email_address][domain]",
										label: "Domain",
										collection: data.available_domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user.uid + "/email_addresses",
								method: "PUT",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user);
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
