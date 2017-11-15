function form(obj) {

	return {
		$type: "form",
		class: "clearfix",
		$components: obj.components,
		action: obj.action,
		method: obj.method,
		enctype: obj.enctype || "application/x-www-form-urlencoded",
		_callbacks: obj.callbacks,
		onsubmit: function(e) {
			// if ( obj.onsubmit ) {
			// 	if ( obj.onsubmit(e) ) {
			// 		$(e.target).find("button").prop("disabled", "disabled");
			// 		console.log("submit 1");
						// 		return false;
			// 	} else {
						// 		console.log("submit 2");
						// 		return false;
			// 	};
			// } else {
						$(e.target).find("button").prop("disabled", "disabled");
			// 	console.log("submit 3");
						// 	return false;
			// };
		},
		$init: function() {
			if ( obj.init ) {
				obj.init( this )
			} else {
				api._bindForm( this );
			};
			$(this).find("input:invalid").first().focus();
		}
	}
};
