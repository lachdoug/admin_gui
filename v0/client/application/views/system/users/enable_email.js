cell({

	id: 'systemUsersUserEnableEmail',

	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user enable email" } ),
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
										type: "select",
										name: "data[email_address][domain]",
										label: "Domain",
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
								],
								action: "/system/users/user/" + user.uid + "/setup_email",
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
