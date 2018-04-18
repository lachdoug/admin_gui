function markdown(mdText) {
	mdText = ( mdText || "" )
		.replace(/\r\n|\r/g, '\n')
		.replace(/\n/g, '  \n')
		.replace(/\t/g, '    ');
	return {
		$html: marked(mdText)
	};
};
