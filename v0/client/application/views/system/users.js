var $systemUsers = {

	$cell: true,
	id: "systemUsers",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-users", text: "System users" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemControlPanel._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					button( { onclick: systemUsersGroups._live,
										icon: "fa fa-th-list", text: "Groups" } ),
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


};
