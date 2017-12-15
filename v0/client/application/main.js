cell({

	id: "main",

	$init: function () {
		navbar._live();
		system._live();
	},


	_signOut: function () {
		apiRequest( {
			action: "/system/signin",
			method: "DELETE",
			callbacks: {
				200: function() {
					main._renderSignedOut();
				}
			},
		});
	},


	_renderSignedOut: function () {
		$(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		system._kill();
		signIn._live();
	},


	_renderDisconnectedSystem: function () {
		// $(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		$("#pageLoadingSpinner").fadeOut();
		system._kill();
		signIn._kill();
		systemDisconnected._live();
	},


	_renderUnavailableSystem: function( opts={} ) {
		// opts: { behavior: :engines_update or :base_os_update }
		system._kill();
		systemUnavailable._live( opts );
	},


});
