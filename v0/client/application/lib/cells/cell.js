function cell(args){
	var varName = '$cell_' + ( args.id || uniqueVarName() );
	window[varName] = $.extend(
		{
			$cell: true
		},
		args
	);
};

function uniqueVarName() {
	do {
		var varName = 'cellVarName_' + Math.floor( Math.random() * 1e16 );
	} while (
		window['$cell_' + varName] != undefined
	);
	return varName;
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
