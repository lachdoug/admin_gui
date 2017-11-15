$( document ).ready(function(){
	main._live();
});

var $main = {

	$cell: true,
	id: "main",

	$init: function () {
		$(window).on('unload', function(){
    	alert('Are you sure you want to leave?');
   	});
	},


	_live: function () {
		$( this ).show();
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


	// _reloadSystem: function () {
	// 	// $(".modal").modal("hide");
	// 	// $("#pageLoadingSpinner").fadeIn();
	// 	// system._kill();
	// 	system._live();
	// },


	_renderDisconnectedSystem: function () {
		// $(".modal").modal("hide");
		$("#navbarSignOutButton").hide();
		$("#pageLoadingSpinner").fadeOut();
		system._kill();
		systemDisconnected._live();
	},


	_renderUnavailableSystem: function( opts={} ) {
		// opts: { behavior: :engines_update or :base_os_update }
		system._kill();
		systemUnavailable._live( opts );
	},


};
