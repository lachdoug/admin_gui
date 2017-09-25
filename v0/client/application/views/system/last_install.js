var $systemLastInstall = {
	
	$cell: true,
	id: "systemLastInstall",
	
	
	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-history", text: "Last install" } ),
				dialogClass: "modal-lg",
				body: {
					$components: [
						{
							id: "systemLastInstallContent",
							$components: [
								{
									class: "clearfix",
									$components: [
										button( { 
											onclick: "systemControlPanel._live()",
											icon: "fa fa-arrow-up", 
											wrapperClass: "pull-right" 
										} ),
									]
								},
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ) 
							],
							_refresh: function ( data ) {
								this.$components = [ systemLastInstall._content( data ) ];
							},
						}
					]
				}
			}
		);
		this._load();
	},
	
	_load: function () {
		apiRequest({
			action: "/system/last_install",
			callbacks: {
				200: function( data ) {
					systemLastInstallContent._refresh( data );
				},
			}
		});
	},

	
	_content: function ( data ) {
		return {
			$components: [
				{
					class: "clearfix",
					$components: [
						button( { 
							onclick: "systemControlPanel._live()",
							icon: "fa fa-arrow-up", 
							wrapperClass: "pull-right" 
						} ),
						{
							$type: "h4",
							class: "pull-left",
							$text: dig( data, "params", "engine_name" )
						},
					]
				},
				tabs( { 
					items: [ 
						{
							label: "Log",
							body: { $type: "pre", $text: data.log }
						}, 
						{
							label: "Params",
							body: pp( data.params )
						} 
					]
				} )
			]
		};
		
	},
	
};
