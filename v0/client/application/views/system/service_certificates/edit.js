var $systemServiceCertificatesEdit = {

	$cell: true,
	id: "systemServiceCertificatesEdit",


	_live: function ( data ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-shield", text: "Edit service certificate" } ),
				body: {
					$components: [
						pp({ object: data}),
						{ $type: "h4", $text: data.service_name },
						form( {
							components: [
								formField( {
									name: "form[certificate_id]",
									label: "Certificate",
									// value: data.???
								} ),
								formCancel ( {
									onclick: function () {
										systemServiceCertificates._live();
									}
								} ),
								formSubmit(),
							],
							action: "/system/service_certificates/" + data.service_name,
							method: 'PUT',
							callbacks: {
								200: function(response) {
									systemServiceCertificates._live();
								},
							}
						} )
					]
				}
			}
		);
	},


};
