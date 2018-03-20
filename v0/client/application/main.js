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
		api._abortAll();
		system._kill();
		signIn._live();
		systemDisconnected._kill();
	},


	_renderSelectSystem: function () {
		$("#pageLoadingSpinner").fadeOut();
		selectSystem._live();
	},


	_renderDisconnectedSystem: function () {
		$(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		$("#pageLoadingSpinner").fadeOut();
		system._kill();
		signIn._kill();
		systemDisconnected._live();
	},


	_renderUnavailableSystem: function( opts={} ) {
		// opts: { message: "????" }
		api._abortAll();
		system._kill();
		signIn._kill();
		systemUnavailable._live( opts );
	},

	_renderBusySystem: function( opts={} ) {
		// opts: { behavior: :engines_update, :engines_restart, :base_os_update, :base_os_restart }
		api._abortAll();
		system._kill();
		signIn._kill();
		systemBusy._live( opts );
	},


	_renderFatalError: function ( error ) {
		this._renderDisconnectedSystem();
		api._abortAll();
		fatalError._live( error );
	},


});
