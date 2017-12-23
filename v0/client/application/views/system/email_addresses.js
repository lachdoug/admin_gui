var $systemEmailAddresses = {

	$cell: true,
	id: "systemEmailAddresses",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System email addresses" } ),
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
					{ $type: "hr" },
				]
			}
		} );

	}

};
