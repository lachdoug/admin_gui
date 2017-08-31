var $systemServiceCertificates = {

	$cell: true,
	id: "systemServiceCertificates",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-shield", text: "Service certificates" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: "systemCertificates._live()",
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{

							id: "systemServiceCertificatesContent",
							_data: null,

							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],

							_render: function ( data ) {
								this._data = data;
							},

							// _remove: function( i ) {
							// 	this._data.splice( i ,1 )
							// },

							$update: function () {
								this.$components = systemServiceCertificates._serviceCertificates( this._data );
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
					systemServiceCertificatesContent._render( data );
				},
			}
		});
	},


	_serviceCertificates: function( data ) {

		return [
			{
	      $type: "table",
	      $components: data.map( function( serviceCertificate, i ) {
	        var serviceCertificatePath = serviceCertificate.service_name + "/" + serviceCertificate.cert_name;
	        var serviceCertificateId = serviceCertificatePath.replace(/\//g, "|");
	  			return {
	          $type: "tr",
	  				$components: [
	            {
	              $type: "td",
	              $components: [
	                button( {
	                  text: serviceCertificate.service_name,
	                  wrapperStyle: "display: inline-block;",
	                  onclick: () => {
	                    systemServiceCertificatesEdit._live( serviceCertificate )
	                  }
	                } ),
	              ]
	            },
	            {
	              $type: "td",
	              $components: [
	                {
	                  $type: "span",
	                  $text: serviceCertificatePath
	                }
	              ]
	            },
	  				]
	  			};
	  		} )
	    },
			pp({ object: data}),
		];
	},

};
