var $systemCertificates = {

	$cell: true,
	id: "systemCertificates",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-certificate", text: "System certificates" } ),
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
							class: "clearfix",
							$components: [
								button( { icon: "fa fa-shield", text: "Service certificates", wrapperClass: "pull-left-md", onclick: systemServiceCertificates._live } ),
								button( { icon: "fa fa-check-square-o", text: "CA", title: "Certificate authority", wrapperClass: "pull-right-md", onclick: systemCertificates._downloadCa } ),
							]
						},
						{ $type: "hr", style: "border-top: 2px solid #eee;" },
						{
							class: "clearfix",
							$components: [
								{ $type: "label", $text: "Installed certificates" },
								button( { icon: "fa fa-plus", text: "Add", title: "Install a new certificate", wrapperClass: "pull-right-md", onclick: systemCertificatesInstall._live } ),
							]
						},
						{

							id: "systemCertificatesContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							_remove: function( i ) {
								this._data.splice( i ,1 )
							},

							$update: function () {
								this.$components = systemCertificates._certificates( this._data );
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
			action: "/system/certificates",
			callbacks: {
				200: function( data ) {
					systemCertificatesContent._render( data );
				},
			}
		});
	},


	_downloadCa: function () {
		apiRequest({
			action: "/system/certificate_authority",
		});
	},


	_certificates: function( data ) {
		return data.map( function( certificate, i ) {
			var certificatePath = certificate.store + "/" + certificate.cert_name;
			return {
				$components: [
					{ $type: "hr" },
					dataList( { class: "dl-horizontal", items: [ { label: "Store" , data: certificate.store }, { label: "Name", data: certificate.cert_name }, ] } ),
					{
						class: "clearfix",
						$components: [
							button( {
								icon: "fa fa-download",
								text: "Download",
								class: "pull-left-md",
								onclick: () => {
									systemCertificates._downloadCertificate( certificatePath )
								}
							} ),
							button( {
								icon: "fa fa-trash",
								text: "Delete",
								class: "pull-right-md",
								onclick: function () {
									if ( confirm("Are you sure that you want to delete certificate " + certificatePath + "?") ) {
										systemCertificates._deleteCertificate( certificatePath, i )
									};
								},
							} ),
						]
					}
				]
			};
		} )
	},


	_downloadCertificate: function( certificatePath  ) {
		apiRequest({
			action: "/system/certificates/",
			params: { certificate_path: certificatePath }
		});
	},


	_deleteCertificate: function( certificatePath , i ) {
		apiRequest({
			action: "/system/certificates/",
			params: { certificate_path: certificatePath },
			method: "DELETE",
			callbacks: {
				200: function () { systemCertificatesContent._remove( i ) }
			}
		});
	},


};
