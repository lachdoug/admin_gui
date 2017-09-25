var $systemCertificatesInstall = {

	$cell: true,
	id: "systemCertificatesInstall",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-upload", text: "Install certificate" } ),
				body: {
					$components: [
						{

							id: "systemCertificatesInstallContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							$update: function () {
								this.$components = [ systemCertificatesInstall._form( this._data ) ];
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
			action: "/system/service_certificates",
			callbacks: {
				200: function( data ) {
					systemCertificatesInstallContent._render( data );
				},
			}
		});
	},


	_form: function( data ) {

		return form( {
			components: [
// pp( data ),
				formField( {
					name: "data[for]",
					id: "systemCertificatesInstallFormInput_target",
					label: "Assign to",
					type: "radios",
					collection: { default: "System default", unassigned: "Unassigned", service: "Service" },
					value: "default",
				} ),

				formField( {
					name: "data[target]",
					label: false,
					type: "select",
					required: true,
					collection: [ "" ].concat( data.map( function( service_certificate ) { return service_certificate.service_name; } ).filter( function( service_name ) { return service_name != "system"; } ) ),
					value: "default",
					dependOn: {
						input: "systemCertificatesInstallFormInput_target_service",
						property: "checked"
					}
				} ),
				// pp(  ),

				formField( {
					name: "format",
					id: "systemCertificatesInstallFormInput_format",
					label: "Format",
					type: "radios",
					collection: { "pem": "PEM", "pkcs": "PFX/PKCS#12" },
					value: "pem",
				} ),

				formField( {
					name: "data[certificate_file]",
					type: "file",
					label: "Certificate file (.pem, .crt, .cer)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[key_file]",
					type: "file",
					label: "Key file (.rsa, .key)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[password]",
					type: "password",
					label: "Password",
					// required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pem",
						property: "checked"
					}
				} ),

				formField( {
					name: "data[certificate_file]",
					type: "file",
					label: "Certificate file (.pfx, .p12)",
					required: true,
					dependOn: {
						input: "systemCertificatesInstallFormInput_format_pkcs",
						property: "checked"
					}
				} ),

				formCancel ( { onclick: systemCertificates._live } ),
				formSubmit(),
			],
			action: "/system/certificates",
			callbacks: {
				200: function(response) {
					systemCertificates._live();
				},
			},
		} );
	},

};
