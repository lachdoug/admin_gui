function renderSystemApp( app, memory ) {

	var title = app.name + ( system._$showContainerMemoryUsage ?
	(
		"\n\nMemory usage" +
		(
			memory ?
			"\nCurrent " + (memory.current/1024/1024).toFixed(1) +
			" MB\nPeak " + (memory.maximum/1024/1024).toFixed(1) +
			" MB\nAllocated " + (memory.limit/1024/1024).toFixed(0) + " MB"
			: "\nnone"
		)
	)	: "" );

	return {
		class: "engines_container",
		$components: [
			{
				$type: "button",
				class: "btn btn-lg btn-custom",
				style: "width: 100%;",
				title: title,
				$components: [
					{
						$components: [
							containerStateIcon(app.state),
							{
								$type: "span",
								$text: app.name
							},
							( app.had_oom || app.restart_required ) ? {
								$type: "span",
								$components: [
									{ $type: "span", $html: "&nbsp;" },
									icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
								]
							} : {},
						]
					},
					system._$showSoftwareTitles ? {
						style: "width: 100%; height: 24px; margin-top: -5px; overflow-x: hidden;",
						$components: [
							{
								id: "systemAppTitle" + app.name,
								$type: "small",
								style: "color: #333;",
								$text: systemApps._titleFor(app.name),
								_refresh: function( appTitle ) {
									this.$text = appTitle;
								}
							},
						],
					} : {},
					system._$showContainerMemoryUsage ?
					{
						$type: "p",
						style: "border-radius: 5px !important; min-height: 10px; box-shadow: 0px 0px 5px 0px #eee inset;",
						title: title,
						$components: [
							( memory && memory.current ) ?
							{
								style: "line-height: 0px; position: relative;",
								$components: [
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.current/memory.limit > 0.9 ? "#F00c" : "#48dc") + "; box-shadow: 0px 0px 10px 0px #999 inset; display: inline-block; height: 10px; width: " + memory.current / memory.limit * 100 + "%; min-width: 10px;",
									},
									{
										style: "position: absolute; border-radius: 5px !important; background-color: " + ( memory.maximum/memory.limit > 0.9 ? "#F003" : "#48d3") + "; display: inline-block; height: 10px; width: " + memory.maximum / memory.limit * 100 + "%; min-width: 10px;",
									}
								]
							} : {}
						],
					} : {},
				],
				onclick: function () { appMenu._live( app.name ) }
			},
		],

	};

};
