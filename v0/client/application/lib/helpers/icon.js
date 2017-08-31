function icon(args) {
//	debugger;
	return {
		$type: "span",
		style: args.style || null,
		$components: [
			{ $type: "i", class: args.icon },
			{ $type: "span", $text: " " + ( args.text || "" ) }
		]
	}
};
