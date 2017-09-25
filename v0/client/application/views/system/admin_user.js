var $systemAdminUser = {
	
	$cell: true,
	id: "systemAdminUser",
	
	
	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-user", text: "Admin user" } ),
				body: {
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
						{
							id: "systemAdminUserContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ) 
							],
							_refresh: function ( data ) {
								this.$components = [ systemAdminUser._content( data ) ];
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
			action: "/system/user/admin",
			callbacks: {
				200: function(response) {
					systemAdminUserContent._refresh(response);
				},
			}
		});
	},

	
	_content: function ( data ) {
//		debugger
		return {
			$components: [
				{
					$type: "label",
					$text: "email"
				},
				{
					$text: data.email
				},
				{ $type: "hr" },
				button( {
					icon: "fa fa-lock",
					text: "Password",
					onclick: "systemAdminUserPassword._live();"
				} ),
				button( {
					icon: "fa fa-envelope",
					text: "Email",
					onclick: "systemAdminUserEmail._live();"
				} ),
			]
		};
		
	},
	
};
