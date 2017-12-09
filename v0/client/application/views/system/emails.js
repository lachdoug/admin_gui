var $systemEmails = {

	$cell: true,
	id: "systemEmails",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-envelope", text: "System emails" } ),
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
					button( { onclick: systemEmailsGroups._live,
										icon: "fa fa-th-list", text: "Groups" } ),
					{ $type: "hr" },
				]
			}
		} );

	}

};
