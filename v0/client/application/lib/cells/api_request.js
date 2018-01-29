function apiRequest (args) {

	return api._request({
		action: args.action,
		method: args.method,
		data: args.data,
		callbacks: args.callbacks,
	});

};
