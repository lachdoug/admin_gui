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
	} else if ( state == "kill" ) { 
		return "fa fa-circle-o-notch fa-spin"
	} else if ( state == "create" ) { 
		return "fa fa-wrench"
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
		return "yellow"
	} else {
		return "grey"
	}; 
};