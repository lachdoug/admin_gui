function dataLoader( args ) {

	return {
		$components: [
			icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
		],
		$init: function() {
			this._load()
		},
		_refresh: function ( data ) {
			this.$components = [
				args.render ? args.render(data) : pp(data)
			];
		},

		_load: function () {
			var target = this;
			var data = $.extend({}, ( args.params || {} ), ( args.data || {} ) );
			api._request({
				action: args.action,
				method: args.method,
				data: data,
				callbacks: {
					200: function(response) {
						target._refresh(response);
					},
				}
			});

		},


	};

};
