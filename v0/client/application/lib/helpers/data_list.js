function dataList (args) {
	return {
		$type: "dl",
//		class: ( args.horizontal != false ? "dl-horizontal" : null ),
		class: ( args.class || null ),
		$components: args.items.map( function ( item ) {
			return {
				$components: [
					{ $type: "dt", $html: ( item.label || "" ) },
					( typeof item.data === 'object' ? { $type: "dd", $components: [ item.data ] } : { $type: "dd", $html: ( item.data ) } )
				]
			}
		} )
	};
}
