cell({

	id: 'systemReinstate',

	_live: function () {

		modal._live ( {
			header: icon( {
				icon: "fa fa-retweet",
				text: "System reinstate"
			} ),
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
					{ $type: "p", $text: "Perform system check and repair container states." },
					button( {
						icon: "fa fa-check",
						text: "OK",
						wrapperClass: "pull-right",
						onclick: systemReinstate._reinstate
					} ),

				]
			}
		} );
	},

	_reinstate: function () {
		apiRequest({
			action: "/system/reinstate",
			method: "put",
			callbacks: {
				200: function() {
					alert("Successfully initiated check.")
					systemControlPanel._live();
				}
			}
		});
	},

});
