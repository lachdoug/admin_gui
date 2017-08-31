function form(obj) {
//	debugger;
	return {
		$type: "form",
		class: "clearfix",
		$components: obj.components,
		action: obj.action,
		method: obj.method,
		enctype: obj.enctype || "application/x-www-form-urlencoded",
		_callbacks: obj.callbacks,
		$init: function() {
			api._bindForm(this);
			$("input:invalid").first().focus();
		}
	}
};