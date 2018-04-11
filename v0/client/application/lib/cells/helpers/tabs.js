function tabs ( args ) {
	return {
		$components: [
			{
				$type: "ul",
				class: "nav nav-tabs",
				style: "margin-bottom: 5px;",
				$components: args.items.map( function (item, i) {
					return {
						$type: "li",
						class: i == 0 ? "active" : "",
						$components: [
							{
								$type: "a",
								$text: item.label,
								onclick: function () {
									$(this).parent().parent().children().removeClass('active');
									$(this).parent().addClass('active');
									$(this).parent().parent().next().children().removeClass('active');
									$(this).parent().parent().next().children().eq(i).addClass('active');
								}
							}
						]

					};
				} )
			},
			{
				class: "tab-content",
				$components: args.items.map( function (item, i) {
					return {
						class: "tab-pane" + ( i == 0 ? " active" : "" ),
						$components: [ item.body ]
					};
				} )
			},
		]
	}
};
