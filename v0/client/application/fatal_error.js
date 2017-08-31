var $fatalError = {

	$cell: true,
	id: "fatalError",


	_live: function (error) {

		$$("#modal")._live ( {
			header: icon( { icon: "fa fa-bug", text: "Bug" } ),
			body: {
				$components: [
					{
						$type: "p",
						$text: "Sorry, you have encountered a bug in Engines."
					},
					{
						class: "clearfix",
						$components: [
							button( { onclick: "$('#fatalErrorDetail').toggle();", wrapperClass: "pull-left",
												icon: "fa fa-info", text: "Detail", title: "Error detail" } ),
							button( { onclick: "$$('#modal')._kill();", wrapperClass: "pull-right",
												icon: "fa fa-times", text: "Close", title: "Return to system" } ),
						]
					},
					pp( {
						id: "fatalErrorDetail",
						style: "display: none;",
						object: error } ),
				]
			}
		} );

	}

};
