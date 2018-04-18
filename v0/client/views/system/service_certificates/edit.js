var $systemServiceCertificatesEdit = {

	$cell: true,
	id: "systemServiceCertificatesEdit",


	_live: function ( serviceCertificateData ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-shield", text: "Edit service certificate" } ),
				body: {
					$components: [
						{ $type: "h4", $text: serviceCertificateData.service_name },
						{
							id: "systemServiceCertificatesEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function( systemCertificatesData ) {
								this.$components = [
									systemServiceCertificatesEdit._form(
										serviceCertificateData,
										systemCertificatesData
									)
								];
							},
						}
					]
				},
			}
		);
		this._load();
	},

	_load: function () {
		apiRequest({
			action: "/system/certificates",
			callbacks: {
				200: function( data ) {
					systemServiceCertificatesEditForm._refresh( data );
				},
			}
		});
	},


	_form: function( serviceCertificateData, systemCertificatesData ) {

		return form( {
			components: [
				formField( {
					type: "select",
					name: "data[certificate]",
					label: "Certificate",
					value: serviceCertificateData.cert_name ? serviceCertificateData.store_name + '|' + serviceCertificateData.cert_name : "",
					collection: systemCertificatesData.map( function( availableCertificate ) {
						return [ availableCertificate.store + "|" + availableCertificate.cert_name, availableCertificate.store + " - " + availableCertificate.cert_name ];
					} ),
					collectionIncludeBlank: true,
				} ),
				formCancel ( {
					onclick: function () {
						systemServiceCertificates._live();
					}
				} ),
				formSubmit(),
				{ $type: "br" },
				{ $type: "br" },
				{ $type: "hr" },
				{ $type: "label", $text: "current cert for " + serviceCertificateData.service_name },
				{ $text: serviceCertificateData.store.store_path + serviceCertificateData.service_name },
				{ $type: "br" },
				{ $type: "label", $text: "available system certs" },
				{ $html: systemCertificatesData.map( function( availableCertificate ) {
					return availableCertificate.store + " - " + availableCertificate.cert_name;
				} ).join('<br>') },
				{ $type: "hr" },
				pp( serviceCertificateData ),
				pp( systemCertificatesData ),
			],
			action: "/system/service_certificates/" + serviceCertificateData.service_name,
			method: 'PUT',
			callbacks: {
				200: function(response) {
					systemServiceCertificates._live();
				},
			}
		} );
	},

};
