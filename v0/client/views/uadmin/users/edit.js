cell({

	id: "systemUsersUserEdit",

	_live: function( user_uid ) {
		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System edit user" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user_uid },
					}),
					hr(),
					dataLoader({
						action: "/uadmin/users/accounts/",
						params: { uid: user_uid },
						render: function( data ) {
							return form({
								components: [
									{
										class: "row",
										$components: [
											formField( {
												name: "account[first_name]",
												value: data.first_name,
												required: true,
												label: "First name",
												wrapperClass: "col-sm-6",
											} ),
											formField( {
												name: "account[last_name]",
												value: data.last_name,
												required: true,
												label: "Last name",
												wrapperClass: "col-sm-6",
											} ),
										]
									},
									formCancel ( {
										onclick: function () {
											systemUsersUser._live(user_uid);
										}
									} ),
									formSubmit(),
								],
								action: "/uadmin/users/accounts/",
								params: { uid: user_uid },
								method: 'PUT',
								callbacks: {
									200: function(response) {
										systemUsersUser._live(user_uid);
									},
								}
							});
						}
					}),
				],
			},
		});
	},


});
