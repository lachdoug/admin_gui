cell({

	id: "systemDistributionLists",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-th-list", text: "System distribution lists" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					// hr(),
					// dataLoader({
					// 	action: "/system/user_management/distribution_lists",
					// 	render: function(data) {
					// 		return {
					// 			$components: data.map( function( distribution_list ) {
					// 				return button({
					// 					text: distribution_list.name,
					// 					onclick: function() { systemUsersGroup._live(distribution_list) },
					// 				});
					// 			}),
					// 		};
					// 	}
					// }),
				]
			}
		} );

	},


});
