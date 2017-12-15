function modalNav( args ) {
	return {
		class: "clearfix",
		$components: [
			args.up ? button( {
				onclick: args.up,
				icon: "fa fa-arrow-up",
				wrapperClass: "pull-right"
			} ) : {},
			args.content || {},
		]
	};
};
