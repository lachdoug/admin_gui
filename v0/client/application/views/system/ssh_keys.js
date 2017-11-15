var $systemSshKeys = {

	$cell: true,
	id: "systemSshKeys",


	_live: function () {

		modal._live ( {
			header: icon( { icon: "fa fa-key", text: "System system SSH Keys" } ),
			body: {
				$components: [
					{
						class: "clearfix",
						$components: [
							button( {
								onclick: systemControlPanel._live,
								icon: "fa fa-arrow-up",
								wrapperClass: "pull-right"
							} ),
						]
					},
					{
						$components: [
							button( { onclick: "systemSshKeys._generatePrivate();",
							title: "Generate and download private key",
								icon: "fa fa-user-secret", text: "Private key"	} ),
							{ $type: "hr" },
							{ $type: "label", $text: "Public key" },
							{
								class: "clearfix",
								$components: [
									button( { onclick: "systemSshKeysUploadPublic._live();",
										icon: "fa fa-upload", text: "Upload",
										title: "Upload public key",
										wrapperClass: "pull-right-md"	} ),
									button( { onclick: "systemSshKeys._downloadPublic();",
										icon: "fa fa-download", text: "Download",
										title: "Upload private key",
										wrapperClass: "pull-left-md"	} ),
								]
							}
						]
					}
				]
			}
		} );

	},


	_generatePrivate: function () {
		apiRequest( {
			action: "/system/ssh_keys/private",
		} );
	},


	_downloadPublic: function () {
		apiRequest( {
			action: "/system/ssh_keys/public",
		} );
	},

};
