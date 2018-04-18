cell({

	id: "systemEmailDistributionGroups",

	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution groups" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmail._live,
					}),
					hr(),
					dataLoader({
						action: "/uadmin/email/distribution_groups",
						render: function(data) {
							return {
								$components: [
									button( {
										onclick: systemEmailDistributionGroupNew._live,
										icon: "fa fa-plus",
										text: "New"
									} ),
									{ $type: "hr" },
									{
										$components: data.map( function( distribution_group ) {
											return {
												$components: [
													button({
														text: distribution_group.name,
														onclick: function() { systemEmailDistributionGroup._live(distribution_group.name) },
													}),
													{ $type: "p", style: "margin-left: 30px;", $text: distribution_group.description }
												]
											};
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
