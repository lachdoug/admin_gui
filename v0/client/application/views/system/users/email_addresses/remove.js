cell({

	id: 'systemUserEmailAddressRemove',

	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user remove email address" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user.name },
					}),
					hr(),
					dataLoader({
						action: "/system/users/user/" + user.uid + "/email_addresses/delete",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[email_address]",
										label: "Email address",
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user.uid + "/email_addresses/",
								method: "DELETE",
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
