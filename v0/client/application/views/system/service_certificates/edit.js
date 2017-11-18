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

		// debugger;
		return form( {
			components: [
				formField( {
					type: "select",
					name: "data[certificate]",
					label: "Certificate",
					value: serviceCertificateData.cert_name ? serviceCertificateData.store_name + '|' + serviceCertificateData.cert_name : "",
					collection: systemCertificatesData.map( function( availableCertificate ) {
						return [ availableCertificate.store + "|" + availableCertificate.cert_name, availableCertificate.store + "/" + availableCertificate.cert_name ];
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
				{ $text: serviceCertificateData.store_name + '/' + serviceCertificateData.cert_name },
				{ $type: "br" },
				{ $type: "label", $text: "available system certs" },
				{ $html: systemCertificatesData.map( function( availableCertificate ) {
					return availableCertificate.store + "/" + availableCertificate.cert_name;
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


// var $systemServiceCertificates = {
//
// 	$cell: true,
// 	id: "systemServiceCertificates",
//
//
// 	_live: function() {
// 		modal._live(
// 			{
// 				header: icon( { icon: "fa fa-shield", text: "System service certificates" } ),
// 				body: {
// 					$components: [
// 						{
// 							class: "clearfix",
// 							$components: [
// 								button( {
// 									onclick: "systemCertificates._live()",
// 									icon: "fa fa-arrow-up",
// 									wrapperClass: "pull-right"
// 								} ),
// 							]
// 						},
// 						{
//
// 							id: "systemServiceCertificatesContent",
// 							_data: null,
//
// 							$components: [
// 								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
// 							],
//
// 							_render: function ( data ) {
// 								this._data = data;
// 							},
//
// 							// _remove: function( i ) {
// 							// 	this._data.splice( i ,1 )
// 							// },
//
// 							$update: function () {
// 								this.$components = systemServiceCertificates._serviceCertificates( this._data );
// 							},
//
// 						}
// 					]
// 				}
// 			}
// 		);
// 		this._load();
// 	},
//
//
// 	_load: function () {
// 		apiRequest({
// 			action: "/system/service_certificates",
// 			callbacks: {
// 				200: function( data ) {
// 					systemServiceCertificatesContent._render( data );
// 				},
// 			}
// 		});
// 	},
//
//
// 	_serviceCertificates: function( data ) {
//
// 		return [
// 			{
// 	      $type: "table",
// 	      $components: data.map( function( serviceCertificate, i ) {
// 	        var serviceCertificatePath = serviceCertificate.store_name + "/" + serviceCertificate.cert_name;
// 	        // var serviceCertificateId = serviceCertificatePath.replace(/\//g, "|");
// 	  			return {
// 	          $type: "tr",
// 	  				$components: [
// 							// pp( serviceCertificate ),
// 	            {
// 	              $type: "td",
// 	              $components: [
// 	                button( {
// 	                  text: serviceCertificate.service_name,
// 	                  wrapperStyle: "display: inline-block;",
// 	                  onclick: () => {
// 	                    systemServiceCertificatesEdit._live( serviceCertificate )
// 	                  }
// 	                } ),
// 	              ]
// 	            },
// 	            {
// 	              $type: "td",
// 	              $components: [
// 	                {
// 	                  $type: "span",
// 	                  $text: serviceCertificatePath
// 	                }
// 	              ]
// 	            },
// 	  				]
// 	  			};
// 	  		} )
// 	    },
// 			// pp( data ),
// 		];
// 	},
//
// };
