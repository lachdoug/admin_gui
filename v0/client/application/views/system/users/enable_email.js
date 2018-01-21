cell({

	id: 'systemUsersUserEnableEmail',

	_live: function (user_uid) {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System user enable email" } ),
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
										type: "select",
										name: "data[domain]",
										label: "Domain",
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
								],
								action: "/system/users/user/" + user_uid + "/setup_email",
								method: "PUT",
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
