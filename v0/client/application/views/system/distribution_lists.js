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
					hr(),
					dataLoader({
						action: "/system/email/distribution_lists",
						render: function(data) {
							return {
								$components: [
									button( {
										onclick: systemEmailDistributionListNew._live,
										icon: "fa fa-plus",
										text: "New"
									} ),
									{ $type: "hr" },
									{
										$components: data.distribution_lists.map( function( distribution_list ) {
											return button({
												text: distribution_list.name,
												onclick: function() { systemEmailDistributionList._live(distribution_list) },
											});
										})
									}
								],
							};
						}
					}),
				]
			}
		} );

	},


});
