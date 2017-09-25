var $systemUpdateBaseOS = {

	$cell: true,
	id: "systemUpdateBaseOS",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-refresh", text: "Update Base OS" } ),
				body: {
					$components: [
						icon( { icon: "fa fa-spinner fa-spin", text: "Checking for updates." } )
					]
				}
			}
		);
		this._startUpdate();
	},


	_startUpdate: function () {
		apiRequest({
			action: "/system/update_base_os",
			callbacks: {
				200: function() {
					systemUnavailable._live( "Base OS update is starting." );
				},
				405: function() {
					systemUpdateBaseOS._alreadyUpToDate();
				}
			}
		});
	},


	_alreadyUpToDate: function () {

		modal._live(
			{
				header: icon({icon: "fa fa-refresh", text: "Update Base OS"}),
				body: {
					class: "clearfix",
					$components: [
						{ $text: "Base OS is already up-to-date." },
						button( {
							onclick: systemMenu._live,
							icon: "fa fa-check",
							text: "OK",
							wrapperClass: "pull-right"
						} )
					]
				}
			}
		);
	},

};
