var $appMenu = {

	$cell: true,
	id: "appMenu",

	_appName: null,
	_appData: null,


	_live: function( appName ) {

		this._appName = appName;
		this._appData = system._appDataFor( appName );
		this._show();

	},


	_show: function () {

		var appName = this._appName;
		var appData = this._appData;
		var state = appData.state;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-mobile",
					text: "App menu"
				} ),
				body: {
					id: "appMenuContent",
					$components: [
						{
							class: "clearfix",
							$components: [
								{ $type: "h4", class: "pull-left-md", $text: appName },
								button( {
									icon: "fa fa-cogs",
									text: "Control panel",
									class: "pull-right-md",
									onclick: function () { appControlPanel._live( appName ); }
								} ),
							]
						},
						{ $type: "hr" },
						appMenu._oomMessage( appData.had_oom ),
						{
							style: "min-height: 85.8px;",
							$components: [
								appMenu._needsRestartMessage( appData.restart_required ),
								appMenu._stateDisplay( appData ),
								appMenu._instructionMessage( state ),
								appMenu._stateInstructions( state ),
							]
						},
						{ $type: "hr" },
						// pp(appData),
						appMenu._websites(),
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
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/apps/" + this._appName + "/websites",
			callbacks: {
				200: function( data ) {
					appMenuWebsites._refresh( data );
				},
			}
		});
	},


	_websites: function ( websites ) {

		var appName = this._appName;

		return {
			id: "appMenuWebsites",

			// $components: [
			// 	// icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
			// ],

			_refresh: function( websites ) {
				this.$components = [
					button( $.extend( {
		 				icon: "fa fa-globe",
		 				text: "Websites",
		 				class: "pull-left-md",
		 				onclick: function () { appWebsites._live( appName ); },
		 			}, websites.length == 0 ? { disabled: "disabled", title: 'No websites' } : {} ) )
				]
			}
		};
	},


	_oomMessage: function ( hadOom ) {

		return {

			id: "appMenuOomMessage",
			_hadOom: null,

			$init: function () {
				this._hadOom = hadOom;
			},

			$update: function () {
				this.$components = [
					this._hadOom ? {
						$components: [
							{
								class: "clearfix",
								$components: [
									{
										class: "pull-left",
										style: "padding-top: 10px;",
										$components: [
											icon( { icon:"fa fa-warning", text: "Ran out of memory", style: "color: red;" } ),
										]
									},
									button( {
										class: "pull-right",
										icon: "fa fa-check",
										text: "OK",
										onclick: appMenu._clearOom
									} ),
								]
							},
							{ $type: "hr" },
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._appState = state;
			}

		};
	},


	_needsRestartMessage: function( needsRestart ) {

		return {

			id: "appMenuNeedsRestartMessage",
			_needsRestart: null,

			$init: function () {
				this._needsRestart = needsRestart;
			},

			$update: function () {
				this.$components = [
					this._needsRestart ? {
						$type: "p",
						$components: [
							icon( {
								icon:"fa fa-warning", text: "Needs restart", style: "color: red;"
							} )
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._needsRestart = state;
			}

		};
	},


	_handleContainerEvent: function( event ) {

		if ( event.container_type == "app" && this._appName == event.container_name && typeof appMenuContent !== 'undefined' ) {
			appMenuStateInstructions._refresh( event.status.state );
			appMenuStateDisplay._refresh( event.status );
			appMenuNeedsRestartMessage._refresh( event.status.restart_required );
			appMenuOomMessage._refresh( event.status.had_oom );
		};
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


	_stateInstructions: function( state ) {

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
			_refresh: function( state ) {
				this._appState = state;
			}
		};

	},


	_stateDisplay: function( appData ) {

		return {
			id: "appMenuStateDisplay",
			style: "display: inline-block;",
			_appData: null,
			$init: function () {
				this._appData = appData;
			},
			$update: function () {
				this.$components = [
					{
						$type: "h4",
						style: "margin-left: 17px;",
						title: "Container state is " + this._appData.state + ( this._appData.state == "stopped" ? " (" + this._appData.why_stop + ")." : "." ),
						$components: [
							containerStateIcon(this._appData.state),
							{
								$type: "span",
								$text: this._appData.state
							}
						]
					}
				];
			},
			_refresh: function( appData ) {
				this._appData = appData;
			}
		};

	},


	_instruct: function (instruction) {

		appMenuInstructionMessage._showMessage("Sending " + instruction + " instruction");
		var appName = this._appName;
		apiRequest( {
			action: "/apps/" + appName + "/instruct?instruction=" + instruction,
			callbacks: {
				200: function(e) {
					if ( instruction == "reinstall" ) {
						system._live();
						// Causes build progress to open
					}	else if ( appMenu._appName == appName ) {
						// Check matching app name because a different app menu may have
						// been opened by user during wait for instruction response
						appMenuInstructionMessage._showMessage("Sent " + instruction + " instruction");
					};
				}
			},
		} );

	},


	_containerInstructions: function(state) {

		var appName = this._appName;
		if (state == "running" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('restart'); }, icon: "fa fa-play-circle", text: "Restart", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('pause'); }, icon: "fa fa-pause", text: "Pause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "stopped" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('start'); }, icon: "fa fa-play", text: "Start", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('destroy'); }, icon: "fa fa-bomb", text: "Destroy", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('recreate'); }, icon: "fa fa-wrench", text: "Recreate", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "paused" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('unpause'); }, icon: "fa fa-pause-circle", text: "Unpause", wrapperStyle: "display: inline-block"})
				]
			};
		} else if ( state == "nocontainer" ) {
			return {
				$components: [
					button({ onclick: function () { appMenu._instruct('create'); }, icon: "fa fa-wrench", text: "Create", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appMenu._instruct('reinstall'); }, icon: "fa fa-plus-circle", text: "Reinstall", wrapperStyle: "display: inline-block"}),
					button({ onclick: function () { appUninstall._live( appName ); }, icon: "fa fa-minus-square", text: "Uninstall", wrapperStyle: "display: inline-block"})
				]
			};
		} else {
			return { style: "height: 46px;" };
		};
	},


	_clearOom: function () {
		var appName = this._appName;
		apiRequest( {
			action: "/apps/" + appName + "/had_oom",
			method: "DELETE",
			callbacks: {
				200: function(e) {
					system._live( function () {
						appMenu._live( appName );
					} );
				}
			},
		} );
	}

};
