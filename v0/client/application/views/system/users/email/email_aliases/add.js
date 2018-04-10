cell({

	id: 'systemUserEmailAliasesAdd',

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
						action: "/system/email",
						render: function(data) {

							return form({
								components: [
									formField( {
										name: "alias[local_part]",
										label: "Local part (before the @)",
										required: true,
									} ),
									formField( {
										type: "select",
										name: "alias[domain]",
										label: "Domain",
										value: data.default_domain,
										collection: data.domains,
									} ),
									formCancel ( { onclick: function() { systemUserEmail._live(user_uid, { scrollTo: "systemUserEmailAliasesArea" }) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/email/aliases/",
								params: { user_uid: user_uid },
								method: "POST",
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
