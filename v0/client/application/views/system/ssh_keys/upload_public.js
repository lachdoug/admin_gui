var $systemSshKeysUploadPublic = {

	$cell: true,
	id: "systemSshKeysUploadPublic",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-caret-square-o-right", text: "Side load" } ),
				body: {
					$components: [
						form( {
							components: [
								formField( {
									name: "data[key_file]",
											id: "systemSshKeysUploadPublicField_key",
											type: "file",
											label: "Public key file",
											required: true
								} ),
								formCancel ( { onclick: "systemSshKeys._live();" } ),
								formSubmit(),
							],
							enctype: "multipart/form-data",
							action: "/system/ssh_keys/public",
							method: "PUT",
							callbacks: {
								200: function(response) {
									systemSshKeys._live();
								},
//								405: function(response) {
//									alert("Failed to upload key.")
//									systemSshKeys._live();
//								},
							}
						} )
					]
				}
			}
		);
	},

};
