function button( args ) {
	return {
		class: ( args.wrapperClass || null ),
		style: ( args.wrapperStyle || null ),
		id: ( args.wrapperId || null ),
		$components: [
			buttonUnwrapped( args )
		]
	}
};

function buttonUnwrapped( args ) {
	return $.extend( {
		$type: "button",
		type: "button",
		id: args.id,
		style: args.style || null,
		class: "btn btn-lg btn-custom " + ( args.class || "" ),
		title: (args.title || args.text || args.for),
		$components: [
			{ $type: "i", class: ( args.icon == false ? "" : args.icon || "fa fa-angle-right" ) },
			{ $type: "span",
			  $text: args.text ? " " + args.text : null }
		],
		onclick: args.onclick,
		onMouseOver: args.onMouseOver,
		onMouseOut: args.onMouseOut,
	}, args.disabled ? { disabled: "disabled" } : {} );
};
