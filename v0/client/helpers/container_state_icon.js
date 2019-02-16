
// this._appData.state !== this._appData.set_state ? {
// 	$type: "span",
// 	$components: [
// 		{ $type: "span", $text: "/ " },
// 		containerStateIcon(this._appData.set_state),
// 		// icon( { icon: "fa fa-spinner fa-spin" } ),
// 		{ $type: "span", $text: " " },
// 	]
// } : {
// 	$type: "span"
// },

function containerStateIcons(state, set_state) {
	return {
		$type: "span",
		$components: [
			containerStateIcon(state),
			state !== set_state ? {
				$type: 'span',
				$components: [
					{
						$type: "span",
						style: "color: #bbb;",
						$components: [
							icon ( {icon: "fa fa-long-arrow-right" } ),
						]
					},
					containerStateIcon(set_state),
					// { $type: "span", $text: " "},
				]
			} : {$type: 'span'},
		]
	};
};


function containerStateIcon(state) {
	return {
		$type: "span",
		style: "color: " + containerStateIconColor(state),
		$components: [
			icon ( {icon: containerStateIconClass(state) } )
		]
	};
};

function containerStateIconClass(state) {
	if ( state == "stopped" ) {
		return "fa fa-stop"
	} else if ( state == "running" ) {
		return "fa fa-play"
	} else if ( state == "paused" ) {
		return "fa fa-pause"
	} else if ( state == "nocontainer" ) {
		return "fa fa-circle-o"
	} else if ( state == "kill" || state == "create" ) {
		return "fa fa-circle-o-notch fa-spin"
	} else {
		return "fa fa-question"
	};
};

function containerStateIconColor(state) {
	if ( state == "stopped" ) {
		return "darkblue"
	} else if ( state == "running" ) {
		return "green"
	} else if ( state == "paused" ) {
		return "orange"
	} else {
		return "grey"
	};
};
