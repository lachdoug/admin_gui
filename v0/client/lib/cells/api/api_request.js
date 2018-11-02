function apiRequest (args) {

	var query_params = jQuery.param( args.params || {} );

	return api._request({
		action: args.action + "?" + query_params,
		method: args.method,
		data: args.data,
		callbacks: args.callbacks,
		filename: args.filename
	});

};

// function apiRequestDownloadStream (args) {
//
// 	var query_params = jQuery.param( args.params || {} );
//
// 	return api._downloadStream({
// 		action: args.action + "?" + query_params,
// 		callbacks: args.callbacks,
// 	});
//
// };
