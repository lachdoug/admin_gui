cell({

	id: 'systemUserEmailAliasesRemove',

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
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "address",
										label: "Remove email alias",
										value: "",
										collectionIncludeBlank: true,
										collection: data.email.aliases,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" }) } } ),
									formSubmit(),
								],
								action: "/uadmin/users/email/aliases/",
								params: { user_uid: user_uid },
								method: "DELETE",
								callbacks: {
									200: function(response) {
										systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" });
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
