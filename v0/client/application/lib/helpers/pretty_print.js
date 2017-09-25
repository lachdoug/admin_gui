function prettyPrint( args ){
	return {
		$type: "pre",
		id: args.id,
		style: "white-space: pre-wrap; " + ( args.style || "" ),
		$components: [ { $text: JSON.stringify(args.object, null, 2) } ] }
};

function pp( object ) { return prettyPrint( { object: object } ) };
