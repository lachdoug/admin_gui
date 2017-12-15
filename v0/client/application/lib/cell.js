function cell(args){
	args.id = args.id || ( "cell" + Date.now() + Math.random() );
	window['$' + args.id] = $.extend(
		{
			$cell: true
		},
		args
	);
};

// cell({
// 	_$data: 1,
// 	$init: function() { this.$update() },
// 	$update: function() {
// 		this.$components = [
// 			button({
// 				text: this._$data,
// 				onclick: function() {
// 					this.parentNode._$data = this.parentNode._$data + 1;
// 				},
// 			})
// 		];
// 	},
// });
//
// cell({
// 	$components: [
// 		dataLoader({
// 			action: 'system/containers/apps',
// 			render: function(data) {
// 				return pp(data);
// 			},
// 		}),
// 		dataLoader({
// 			action: 'system/containers/services',
// 			render: function(data) {
// 				return pp(data);
// 			},
// 		}),
// 	],
// });
