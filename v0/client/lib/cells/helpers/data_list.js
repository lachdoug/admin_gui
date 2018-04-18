function dataList (args) {
	return {
		$type: "dl",
		class: ( args.class || null ),
		$components: args.items.map( function ( item ) {

			return {
				$components: [
					{ $type: "dt", title: item.label, $html: ( item.label || "" ) },
					(
						typeof item.data === 'object' ?
						{ $type: "dd", title: item.label, $components: [ item.data || {} ] } :
						{ $type: "dd", title: item.label, $html: ( item.data || '' ) }
					)
				]
			}
		} )
	};
}
