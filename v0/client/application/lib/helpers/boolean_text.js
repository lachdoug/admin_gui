function booleanText(booleanData) {
	if (booleanData) {
		return icon( { icon: "fa fa-check", text: "True" } )
	} else {
		return icon( { icon: "fa fa-times", text: "False" } )
	};
};