function enginesIconSvg(size) {
	return {
		$type: "span",
		$html: `
			<svg width='` + size + `' height='` + size + `' style='vertical-align: middle;'>
			<g transform='scale(` + ( size * 0.3333333 / 100 ) + `)'>
				<path d='
					M 150,300 L 280,225 L 280,75 L 150,0 L 20,75 L 20,225 L 150,300
					M 50,150 A 100,100 0 1,0 250,150 A 100,100 0 1,0 50,150 Z'
					style='fill:#48D;stroke-width:0' fill-rule='evenodd'>
				</path>
			</g>
		</svg>`
	};
};
