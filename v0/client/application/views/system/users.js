cell({

	id: "systemUsers",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System users" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemUserManagement._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					button( {
						onclick: systemUsersNew._live,
						icon: "fa fa-plus",
						text: "Add"
					} ),
					{ $type: "hr" },
					{
						id: "systemUsersContent",
						$components: [
							icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
						],
						_refresh: function ( data ) {
							this.$components = data.map( function( user ) {
								return button({
									text: user.name,
									onclick: function() { systemUsersUser._live(user) },
								});
							});
						},
					},

				]
			}
		} );
		this._load();
	},


	_load: function () {

		apiRequest({
			action: "/system/users",
			callbacks: {
				200: function(response) {
					systemUsersContent._refresh(response);
				},
			}
		});

	},


});
