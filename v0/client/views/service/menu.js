var $serviceMenu = {

	$cell: true,
	id: "serviceMenu",

	_serviceName: null,
	_serviceData: null,


	_live: function( serviceName ) {

		this._serviceName = serviceName;
		this._serviceData = systemServices._dataFor( serviceName );
		this._show();

	},


	_show: function () {

		var serviceName = this._serviceName;
		var serviceData = this._serviceData;
		var state = serviceData.state;

		modal._live (
			{
				header: icon ( {
					icon: "fa fa-mobile",
					text: "Service menu"
				} ),
				body: {
					id: "serviceMenuContent",
					$components: [
						{
							class: "clearfix",
							$components: [
								{ $type: "h4",
									class: "pull-left-md",
									$text: serviceName },
								button( {
									icon: "fa fa-cogs",
									text: "Control panel",
									wrapperClass: "pull-right-md",
									onclick: function () { serviceControlPanel._live( serviceName ); }
								} ),
							]
						},
						{ $type: "hr" },
						serviceMenu._oomMessage( serviceData.had_oom ),
						{
							style: "min-height: 85.8px;",
							$components: [
								serviceMenu._needsRestartMessage( serviceData.restart_required ),
								serviceMenu._stateDisplay( serviceData ),
								serviceMenu._instructionMessage( state ),
								serviceMenu._stateInstructions( serviceData ),
							]
						},
						{ $type: "hr" },
						serviceMenu._websites(),
						button( {
							icon: "fa fa-info-circle",
							text: "About",
							class: "pull-right-md",
							onclick: function () { serviceAbout._live(serviceName); },
						} )

					]
				}
			}
		);
		this._load();
	},


	_load: function() {
		apiRequest({
			action: "/services/" + this._serviceName + "/websites",
			callbacks: {
				200: function( data ) {
					serviceMenuWebsites._refresh( data );
				},
			}
		});
	},


	_websites: function ( websites ) {

		var serviceName = this._serviceName;

		return {
			id: "serviceMenuWebsites",
			_refresh: function( websites ) {
				this.$components = [
					button( $.extend( {
		 				icon: "fa fa-globe",
		 				text: "Websites",
		 				class: "pull-left-md",
		 				onclick: function () { serviceWebsites._live( serviceName ); },
		 			}, websites.length == 0 ? { disabled: "disabled", title: 'No websites' } : {} ) )
				]
			}
		};
	},



	_oomMessage: function ( hadOom ) {

		return {

			id: "serviceMenuOomMessage",
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
										onclick: serviceMenu._clearOom
									} ),
								]
							},
							{ $type: "hr" },
						]
					} : {},
				];
			},

			_refresh: function( state ) {
				this._serviceState = state;
			}

		};
	},


	_needsRestartMessage: function( needsRestart ) {

		return {

			id: "serviceMenuNeedsRestartMessage",
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
		if ( event.container_type == "service" && this._serviceName == event.container_name && typeof serviceMenuContent !== 'undefined' ) {
			serviceMenuStateInstructions._refresh( event.status );
			serviceMenuStateDisplay._refresh( event.status );
			serviceMenuNeedsRestartMessage._refresh( event.status.restart_required );
			serviceMenuOomMessage._refresh( event.status.had_oom );
		};
	},


	_instructionMessage: function () {

		return {
			style: "font-size: 12px; display: inline-block;",
			id: "serviceMenuInstructionMessage",
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


	_stateInstructions: function( status ) {

		return {
			id: "serviceMenuStateInstructions",
			_serviceStatus: null,
			$init: function () {
				this._serviceStatus = status;
			},
			$update: function () {
				this.$components = [
					serviceMenu._containerInstructions(this._serviceStatus),
				];
			},
			_refresh: function( status ) {
				this._serviceStatus = status;
			}
		};

	},


	_stateDisplay: function( serviceData ) {
// debugger
		return {
			id: "serviceMenuStateDisplay",
			style: "display: inline-block;",
			_serviceData: null,
			$init: function () {
				this._serviceData = serviceData;
			},
			$update: function () {
				this.$components = [
					{
						$type: "h4",
						style: "margin-left: 17px;",
						title: "Container state is " + this._serviceData.state + ( ( this._serviceData.state == "stopped" && this._serviceData.why_stop ) ? " (" + this._serviceData.why_stop + ")." : "." ),
						$components: [
							containerStateIcons(this._serviceData.state, this._serviceData.set_state),
							{
								$type: "span",
								$text: this._serviceData.state
							},
							this._serviceData.state !== this._serviceData.set_state ? {
								$type: 'span',
								$components: [
									{ $type: "span", $text: " "},
									{
										$type: "span",
										style: "color: #bbb;",
										$components: [
											icon ( {icon: "fa fa-long-arrow-right" } ),
										]
									},
									{ $type: "span", $text: this._serviceData.set_state },
								]
							} : {$type: 'span'},
						]
					}
				];
			},
			_refresh: function( serviceData ) {
				this._serviceData = serviceData;
			}
		};

	},


	_instruct: function (instruction) {

		serviceMenuInstructionMessage._showMessage("Sending " + instruction + " instruction");
		var serviceName = this._serviceName;
		apiRequest( {
			action: "/services/" + serviceName + "/instruct",
			params: { instruction: instruction },
			callbacks: {
				200: function(e) {
					if ( instruction == "reinstall" ) {
						system._live();
						// Causes build progress to open
					}	else if ( serviceMenu._serviceName == serviceName ) {
						// Check matching service name because a different service menu may have
						// been opened by user during wait for instruction response
						serviceMenuInstructionMessage._showMessage("Sent " + instruction + " instruction");

						systemServices._load()
					};
				}
			},
		} );

	},


	_containerInstructions: function(status) {

		var serviceName = this._serviceName;

		var components = [];

		if ( status.state === "nocontainer" || status.set_state === "nocontainer" ) {
			components.push( { $components: [
				button({ onclick: function () { serviceMenu._instruct('create'); }, icon: "fa fa-wrench", text: "Create", wrapperStyle: "display: inline-block"}),
			]	} )
		}
		if ( status.state === "stopped" || status.set_state === "stopped" ) {
			components.push( { $components: [
				button({ onclick: function () { serviceMenu._instruct('start'); }, icon: "fa fa-play", text: "Start", wrapperStyle: "display: inline-block"}),
				button({ onclick: function () { serviceMenu._instruct('destroy'); }, icon: "fa fa-bomb", text: "Destroy", wrapperStyle: "display: inline-block"}),
				button({ onclick: function () { serviceMenu._instruct('recreate'); }, icon: "fa fa-wrench", text: "Recreate", wrapperStyle: "display: inline-block"})
			]	} )
		}
		if ( status.state === "running" || status.set_state === "running" ) {
			components.push( { $components: [
				( serviceName == 'control' && !remoteManagement ) ? {} : button({ onclick: function () { serviceMenu._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
				button({ onclick: function () { serviceMenu._instruct('restart'); }, icon: "fa fa-play-circle", text: "Restart", wrapperStyle: "display: inline-block"}),
				( serviceName == 'control' && !remoteManagement ) ? {} : button({ onclick: function () { serviceMenu._instruct('pause'); }, icon: "fa fa-pause", text: "Pause", wrapperStyle: "display: inline-block"})
			]	} )
		}
		if ( status.state === "paused" || status.set_state === "paused" ) {
			components.push( { $components: [
				button({ onclick: function () { serviceMenu._instruct('unpause'); }, icon: "fa fa-pause-circle", text: "Unpause", wrapperStyle: "display: inline-block"})
			]	} )
		}

		return { $components: components, style: "min-height: 46px;" }

			;
		// } else {
		// 	if (status.set_state == "running" ) {
		// 		return {
		// 			$components: [
		// 				( serviceName == 'control' && !remoteManagement ) ? {} : button({ onclick: function () { serviceMenu._instruct('stop'); }, icon: "fa fa-stop", text: "Stop", wrapperStyle: "display: inline-block"}),
		// 			]
		// 		};
		// 	} else {
		// 		return { style: "height: 46px;" };
		// 	};
		//
		// }
	},


	_clearOom: function () {
		var serviceName = this._serviceName;
		apiRequest( {
			action: "/services/" + serviceName + "/had_oom",
			method: "DELETE",
			callbacks: {
				200: function(e) {
					modal._kill()
					systemServices._load();
				}
			},
		} );
	}

};
