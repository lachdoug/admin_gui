cell({

	id: 'systemUsersUserMailboxEdit',

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
						action: "/system/users/user/" + user_uid + "/mailbox/edit",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[domain]",
										label: "Domain",
										value: data.mailbox_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user_uid); } } ),
									formSubmit(),
								],
								action: "/system/users/user/" + user_uid + "/mailbox",
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
