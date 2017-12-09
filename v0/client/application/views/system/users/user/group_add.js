var $systemUsersUserGroupAdd = {

	$cell: true,
	id: "systemUsersUserGroupAdd",


	_live: function (user) {

		modal._live ( {
			header: icon( { icon: "fa fa-user", text: "System user add to group" } ),
			body: {
				$components: [
					modalNav({
						content: { $type: "h4", $text: user.name },
						// up: function() { systemUsersUser._live(user) },
					}),
					hr(),
					dataLoader({
						action: "/system/users/groups",
						render: function(data) {

							return form({
								components: [
									formField( {
										type: "select",
										name: "data[group]",
										label: "Add user to group",
										collection: data,
									} ),
									formCancel ( { onclick: function() { systemUsersUser._live(user) } } ),
									formSubmit(),
							//				pp( data )
								],
								action: "/system/users/user",
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

};



function hr() {
	return { $type: "hr" };
};

function modalNav( args ) {
	return {
		class: "clearfix",
		$components: [
			args.up ? button( {
				onclick: args.up,
				icon: "fa fa-arrow-up",
				wrapperClass: "pull-right"
			} ) : {},
			args.content,
		]
	};
};


function dataLoader( args ) {

	return {
		$components: [
			icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
		],
		$init: function() {
			this._load()
		},
		_refresh: function ( data ) {
			this.$components = [
				args.render ? args.render(data) : pp(data)
			];
		},

		_load: function () {
			var target = this;
			apiRequest({
				action: args.action,
				callbacks: {
					200: function(response) {
						target._refresh(response);
					},
				}
			});

		},


	};

};
