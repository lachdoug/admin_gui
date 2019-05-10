cell({

	id: "system",

	_$data: null,
	_$showServices: showServices,
	_$showSoftwareTitles: showSoftwareTitles,
	_$showContainerMemoryUsage: showContainerMemoryUsage,


	_live: function() {
		if ( enableEventStreaming ) { systemEvents._live() };
		this._load();
	},


	_kill: function() {
		systemEvents._close();
		systemMemory._close();
		this._refresh(null);
	},


	_load: function () {
		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response);
					$("#navbarSignOutButton").show();
					$("#pageLoadingSpinner").fadeOut();
				},
				401: function() {
					systemEvents._close();
					main._renderSignedOut();
				}
			}
		});

	},

	_refresh: function(data) {
		this._$data = data;

		if ( this._$data ) {

			var needsAttention = 	this._$data.status.needs_reboot ||
														this._$data.status.needs_engines_update ||
														this._$data.status.needs_base_update;

			if ( this._$data.properties.label.text ) {
				// Show label in browser document title
				document.title = `${this._$data.properties.label.text} - Engines system`;
			} else {
				document.title = 'Engines system';
			}

			this.$components = [
				( this._$data.properties.label.text ? {
					$text: this._$data.properties.label.text,
					style: ( "color: " + this._$data.properties.label.color +
									 "; background-color: " + this._$data.properties.label.background_color +
									"; text-align: center; padding: 10px; font-size: 24px; margin-top: -5px; margin-bottom: 5px;" )
				} : {} ),
				{
					class: "container",
					$components: [
						{
							id: "systemEventsStreamingWarningMessage",
							_live: function() {
								console.log( [ ( new Date ).toLocaleTimeString(), "Container events stream closed." ] )
								this.$components = [
									{
										$type: "p",
										id: 'systemEventsStreamingWarningMessage',
										class: 'text-center',
										$html: "System disconnected. " +
											"Please <a  style='cursor: pointer;' " +
											"onclick='location.reload()'><i class='fa fa-repeat'></i> reload</a> page.</p>",
									}
								];
							}
						},

		inDevelopment ? { $components: [
			button( {
				icon: "fa fa-plus",
				wrapperClass: "clearfix",
				class: "pull-right-md",
				text: "New",
				onclick: () => { appServicesPersistentSubservicesNewType._live(
					"owntest",
					"EnginesSystem",
					"filesystem/local/filesystem",
					"owntest_data"
				); }
			} ),
			button( { onclick: systemOrphanData._live,
				icon: "fa fa-compass", text: "Orphan data" } ),
			button( {
				icon: "fa fa-crosshairs",
				text: 'Actions',
				onclick: () => { serviceOperations._live( "uadmin" ) },
			} )
			// {
			// 	$components: actions.map( function( action ) {
			// 		return
			// 	} )
			// }
			] } : {},





						{
							class: "modal-content",
							style: "overflow-x: hidden; margin-top: 5px; margin-bottom: 100px; padding: 10px;",
							$components: [
								{
									$components: [
										{
											$type: "button",
											class: "btn btn-lg btn-custom",
											title: "System menu",
											$components: [
												icon( { icon: "fa fa-hdd-o", text: "System" } ),
												( needsAttention ?
													{
														$type: "span",
														$components: [
															{ $type: "span", $html: "&nbsp;" },
															icon( { icon: "fa fa-warning", style: "font-size: 14px; color: red;" } )
														]
													}
													: {}
												),
											],
											onclick: systemMenu._live
										},
									]
								},
								renderSystemApps(),
								this._$showServices ? renderSystemServices() : {},
							]
						}
					]
				},
			];

			if ( this._$showContainerMemoryUsage ) {	systemMemory._live(); };
			if ( data.builder.current.engine_name ) { installBuild._live(); };

		} else {
			this.$components = [];
		};

	},

	// $update: function(){
	// 	debugger
	//
	//
	// },

});
