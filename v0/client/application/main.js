$( document ).ready(function(){
	main._live();
});

var $main = {

	$cell: true,
	id: "main",


	_live: function () {
		$( this ).show();
		navbar._live();
		system._live();
	},


	_signOut: function () {
		apiRequest( {
			action: "/session",
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
	}

};
