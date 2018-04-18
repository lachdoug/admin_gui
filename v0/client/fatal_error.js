cell({

	id: "fatalError",

	_live: function (error) {

		modal._live ( {
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
							button( { onclick: modal._kill, wrapperClass: "pull-right",
												icon: "fa fa-times", text: "No thanks" } ),
							{
								$type: 'form',
								$init: function() {
									$(this).submit(function(e) {
										$.ajax({
						           type: "POST",
						           url: bugReportsUrl,
											 dataType : 'json',
						           data: error,
										   complete: function() {
												 modal._kill();
											 }
						        });
								    e.preventDefault();
									});
								},
								$components: [
									{
										$type: 'button',
										type: 'submit',
										title: 'Send report',
										class: 'btn btn-custom btn-lg pull-right',
										$components: [
											icon( {
												icon: 'fa fa-paper-plane-o',
												text: "Send report"
											} )
										]
									}
								]
							},
						]
					},
					{
						id: "fatalErrorDetail",
						style: "display: none;",
						$components: [ pp(error) ] },
				]
			}
		} );

	}

});
