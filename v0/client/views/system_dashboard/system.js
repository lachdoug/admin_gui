cell({

	id: "system",

	_$data: null,
	_$showServices: showServices,
	_$showSoftwareTitles: showSoftwareTitles,
	_$showContainerMemoryUsage: showContainerMemoryUsage,


	_live: function( onloadCallback ) {
		if ( enableEventStreaming ) { systemEvents._live() };
		this._load( onloadCallback );
	},


	_kill: function() {
		systemEvents._close();
		systemMemory._close();
		this._$data = null;
	},


	_load: function ( onupdateCallback ) {
		apiRequest({
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response, onupdateCallback);
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

	_refresh: function(data, onupdateCallback ) {
		this._onupdateCallback = onupdateCallback;
		// let mmm = this._$data == data
		this._$data = data;
		// this.$update();
		if ( this._$showContainerMemoryUsage ) {	systemMemory._live(); };
		if ( data.builder.current.engine_name ) { installBuild._live(); };
	},

	$update: function(){
		if ( this._$data ) {

			var needsAttention = 	this._$data.status.needs_reboot ||
														this._$data.status.needs_engines_update ||
														this._$data.status.needs_base_update;

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
								this.$components = [
									{
										$type: "p",
										id: 'systemEventsStreamingWarningMessage',
										class: 'text-center',
										$html: "System disconnected. " +
											"Please <a  style='cursor: pointer;' " +
											"onclick='location.reload()'>reload</a> page.</p>",
									}
								];
							}
						},

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

						{
							class: "modal-content",
							style: "margin-top: 5px; margin-bottom: 100px; padding: 10px;",
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
			if ( this._onupdateCallback ) { this._onupdateCallback(); };
		} else {
			this.$components = [];
		};

	},

});
