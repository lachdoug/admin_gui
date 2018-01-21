cell({

	id: 'systemUserEmailAddressRemove',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user remove email alias" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/system/users/user/" + user_uid + "/email_addresses/delete",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[email_address]",
										label: "Email address",
										collection: data.email_addresses,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user/" + user_uid + "/email_addresses/",
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid);
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
