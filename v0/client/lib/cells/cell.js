function cell(args){
	var varName = '$cell_' + ( args.id || uniqueVarName() );
	window[varName] = $.extend(	{ $cell: true	}, args	);
};

function uniqueVarName() {
	do {
		var varName = 'cellVarName_' + Math.floor( Math.random() * 1e16 );
	} while (
		window['$cell_' + varName] != undefined
	);
	return varName;
};
