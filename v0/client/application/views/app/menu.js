var $appMenu = {

	$cell: true,
	id: "appMenu",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var state = system._appDataFor(appName).state;
		modal._live (
			{
				header: icon ( {
					icon: "fa fa-mobile",
					text: "App menu"
				} ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								{ $type: "h4", class: "pull-left-md", $text: appName },
								button( {
									icon: "fa fa-globe",
									text: "Websites",
									class: "pull-right-md",
									onclick: function () { appWebsites._live(appName); },
								} ),
							]
						},
						{ $type: "hr" },
						{
							style: "min-height: 85.8px;",
							$components: [
								appMenu._stateDisplay(state),
								appMenu._instructionMessage(state),
								appMenu._stateInstructions(state)
							]
						},
						{ $type: "hr" },
						button( {
							icon: "fa fa-cogs",
							text: "Control panel",
							class: "pull-left-md",
							onclick: function () { appControlPanel._live( appName ); }
						} ),
						button( {
							icon: "fa fa-info-circle",
							text: "About",
							class: "pull-right-md",
							onclick: function () { appAbout._live(appName); },
						} )

					]
				}
			}
		);
	},


	_refreshAppState: function(appStateData) {

		if ( this._appName == appStateData.name ) {

			if ( typeof appMenuStateInstructions !== 'undefined' ) {
				appMenuStateInstructions._appState = appStateData.state;
			};

			if (  typeof appMenuStateDisplay !== 'undefined' ) {
				appMenuStateDisplay._appState = appStateData.state;
			};

		}

	},


	_instructionMessage: function () {

		return {
			style: "font-size: 12px; display: inline-block;",
			id: "appMenuInstructionMessage",
			_showMessage: function ( message ) {
				this.$components = [ {
					$html: " &nbsp; " + message,
					$init: function () {
						setTimeout( function () {
							$( this ).remove();
						}.bind( this ), 2000 );
					}
				} ];
			}
		};

	},


	_stateInstructions: function (state) {

		return {
			id: "appMenuStateInstructions",
			_appState: null,
			$init: function () {
				this._appState = state;
			},
			$update: function () {
				this.$components = [
					appMenu._containerInstructions(this._appState),
				];
			},
			_refresh: function (state) {
				this._appState = state;
			}
		};

	},


	_stateDisplay: function (state) {

		return {
			id: "appMenuStateDisplay",
			style: "display: inline-block;",
			_appState: null,
			$init: function () {
				this._appState = state;
			},
			$update: function () {
				this.$components = [
					{
						$type: "h4",
						style: "margin-left: 17px;",
						$components: [
							containerStateIcon(this._appState),
							{
								$type: "span",
								$text: this._appState
							}
						]
					}
				];
			},
			_refresh: function (state) {
				this._appState = state;
			}
		};

	},


	_instruct: function (instruction) {

		$$('#appMenuInstructionMessage')._showMessage("Sending " + instruction + " instruction");
		var appName = this._appName;
		apiRequest( {
			action: "/apps/" + appName + "/instruct?instruction=" + instruction,
			callbacks: {
				200: function(e) {
					// Check matching app name because a different app menu may have been opened in wait for response
					if ( appMenu._appName == appName ) {
						$$('#appMenuInstructionMessage')._showMessage("Sent " + instruction + " instruction");
					};
				}
			},
		} );

	},


	_containerInstructions: function(state) {

		var appName = this._appName;
		if (state == "running") {
			return {
				$components: [
					button({ onclick: function () { $$('#appMenu')._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appMenu')._instruct('restart'); }, icon: "fa fa-play-circle", text: "Restart", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appMenu')._instruct('pause'); }, icon: "fa fa-pause", text: "Pause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "stopped" ) {
			return {
				$components: [
					button({ onclick: function () { $$('#appMenu')._instruct('start'); }, icon: "fa fa-play", text: "Start", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appMenu')._instruct('destroy'); }, icon: "fa fa-bomb", text: "Destroy", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appMenu')._instruct('recreate'); }, icon: "fa fa-wrench", text: "Recreate", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "paused" ) {
			return {
				$components: [
					button({ onclick: function () { $$('#appMenu')._instruct('unpause'); }, icon: "fa fa-pause-circle", text: "Unpause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "nocontainer" ) {
			return {
				$components: [
					button({ onclick: function () { $$('#appMenu')._instruct('create'); }, icon: "fa fa-wrench", text: "Create", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appMenu')._instruct('reinstall'); }, icon: "fa fa-plus-circle", text: "Reinstall", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { $$('#appUninstall')._live( appName ); }, icon: "fa fa-minus-square", text: "Uninstall", wrapperStyle: "display: inline-block"})
				]
			};
		} else {
			return { style: "height: 46px;" };
		};
	}

};
