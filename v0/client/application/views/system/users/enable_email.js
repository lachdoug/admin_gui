cell({

	id: 'systemUserEnableEmail',

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
						action: "/system/email",
						params: { uid: user_uid },
						render: function(data) {

							return data.default_domain == "" ? {
								$components: [
									{
										$text: "Set up system email domain first."
									},
									button( { icon: "fa fa-check", text: "OK", onclick: function() { systemUsersUser._live(user_uid) } } )
								]
							} : form({
								components: [
									formField( {
										type: "select",
										name: "email[domain_name]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid) } } ),
									formSubmit(),
								],
								action: "/system/users/accounts/email",
								params: { user_uid: user_uid },
								method: "POST",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid);
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
