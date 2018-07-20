var $systemSystemUser = {

	$cell: true,
	id: "systemSystemUser",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-user-md", text: "System user" } ),
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
							id: "systemSystemUserContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ systemSystemUser._content( data ) ];
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
			action: "/system/system_user",
			callbacks: {
				200: function(response) {
					systemSystemUserContent._refresh(response);
				},
			}
		});
	},


	_content: function ( data ) {
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
					onclick: systemSystemUserPassword._live
				} ),
				button( {
					icon: "fa fa-envelope",
					text: "Email",
					onclick: systemSystemUserEmail._live
				} ),
			]
		};

	},

};
