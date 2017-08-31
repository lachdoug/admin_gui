// var $systemCertificatesInstall = {
//
// 	$cell: true,
// 	id: "systemCertificatesInstall",
//
//
// 	_live: function() {
// 		modal._live(
// 			{
// 				header: icon( { icon: "fa fa-upload", text: "Install certificate" } ),
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
//
// 						form( {
// 							components: [
// 								formField( {
// 									name: "form[certificate]",
// 											type: "file",
// 											label: "Certificate file",
// 											required: true
// 								} ),
// 								formCancel ( { onclick: systemCertificates._live } ),
// 								formSubmit(),
// 							],
// 							enctype: "multipart/form-data",
// 							action: "/system/certificates",
// 							method: "PUT",
// 							callbacks: {
// 								200: systemCertificates._live
// 							}
// 						} )
//
//
// 						// {
// 						// 	$components: [
// 						// 		systemCertificatesInstall._zeroconf(),
// 						// 		systemCertificatesInstall._defaultDomain(),
// 						// 		systemCertificatesInstall._domainNames(),
// 						// 	],
// 						// }
// 					]
// 				}
// 			}
// 		);
// 		// this._load();
// 	},
//
// 	_formSubmit: function() {
// 		return {
// 			$components: [
// 				{ $type: "button",
// 					type: "button",
// 					class: "btn btn-lg btn-custom pull-right",
// 					title: "Submit form",
// 					$components: [
// 						{ $type: "i", class: "fa fa-check" },
// 						{ $type: "span", $text: "OK" }
// 					],
// 				 	onclick: function () {
// 						if ( $(this).parents("form")[0].checkValidity() ) {
// 						$(this).parents("form").find("button").prop("disabled", "disabled");
// 							this.$components = [
// 								{ $type: "i", class: "fa fa-hourglass-o" },
// 								{ $type: "span", $text: "OK" }
// 							];
// 						};
// 					}
// 				}
// 			]
// 		};
// 	}
//
//
// // 	_load: function () {
// // 		apiRequest({
// // 			action: "/system/domains",
// // 			callbacks: {
// // 				200: function( data ) {
// // 					systemCertificatesInstallZeroconf._refresh( data.zeroconf );
// // 					systemCertificatesInstallDefault._refresh( data.default );
// // 					systemCertificatesInstallDomainNames._refresh( data.names );
// // 				},
// // 			}
// // 		});
// // 	},
// //
// //
// // 	_zeroconf: function () {
// // 		return {
// //
// // 			id: "systemCertificatesInstallZeroconf",
// // 			_zeroconfEnabled: null,
// //
// // 			$components: [
// // 				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
// // 			],
// //
// // 			_refresh: function( zeroconfEnabled ) {
// // 				this._zeroconfEnabled = zeroconfEnabled
// // 			},
// //
// // 			$update: function () {
// // 				this.$components = [
// // 					{
// // 						class: "clearfix",
// // 						$components: [
// // 							{
// // 								class: "pull-left",
// // 							 	$components: [
// // 									{ $type: "label", $text: "Avahi (zeroconf)" },
// // 									{ $components: [
// // 										this._zeroconfEnabled ?
// // 											icon( { icon:"fa fa-check", text:"local domain is enabled" } ) :
// // 											icon( { icon:"fa fa-times", text:"local domain is disabled" } ),
// // 									] },
// // 								]
// // 							},
// // 							button( this._zeroconfEnabled ?
// // 						 		{icon: "fa fa-toggle-on", text: "Disable", wrapperClass: "pull-right", onclick: "systemCertificatesInstall._disableZeroconf();" } :
// // 						 		{icon: "fa fa-toggle-off", text: "Enable", wrapperClass: "pull-right", onclick: "systemCertificatesInstall._enableZeroconf();" } ),
// // 						]
// // 					},
// // 					{
// // 						$type: "hr",
// // 						style: "border-top: 2px solid #eee;"
// // 					},
// // 				];
// // 			},
// // 		};
// //
// // 	},
// //
// //
// // 	_disableZeroconf: function () {
// // 		if ( systemCertificatesInstallDefault._defaultDomain == "local" ) {
// // 			alert("The default domain is local, which is provided by Avahi.\n\nYou will need to change the default domain before you can disable Avahi.")
// // 		} else {
// // 			apiRequest({
// // 				action: "/system/domains/zeroconf",
// // 				method: "delete",
// // 				callbacks: {
// // 					200: function() {
// // 						systemCertificatesInstallZeroconf._refresh(false)
// // 					}
// // 				}
// // 			});
// // 		};
// // 	},
// //
// //
// // 	_enableZeroconf: function () {
// // 		apiRequest({
// // 			action: "/system/domains/zeroconf",
// // 			method: "post",
// // 			callbacks: {
// // 				200: function() {
// // 					systemCertificatesInstallZeroconf._refresh(true);
// // 				}
// // 			}
// // 		});
// // 	},
// //
// //
// // 	_defaultDomain: function () {
// // 		return {
// // 			id: "systemCertificatesInstallDefault",
// // 			_defaultDomain: null,
// //
// // 			_refresh: function( defaultDomain ) {
// // 				this._defaultDomain = defaultDomain
// // 			},
// //
// // 			$update: function () {
// // 				this.$components = [
// // 					{
// // 						class: "clearfix",
// // 						$components: [
// // 							{
// // 								class: "pull-left",
// // 							 	$components: [
// // 									{	$type: "label", $text: "Default domain"	},
// // 									{ $text: this._defaultDomain },
// // 								]
// // 							},
// // 							button( {icon: "fa fa-edit", text: "Edit", wrapperClass: "pull-right", onclick: "systemCertificatesInstallDefaultEdit._live();" } ),
// // 						]
// // 					},
// // 					{
// // 						$type: "hr",
// // 						style: "border-top: 2px solid #eee;"
// // 					},
// // 				];
// // 			},
// // 		};
// //
// // 	},
// //
// //
// // 	_domainNames: function () {
// // 		return {
// // 			id: "systemCertificatesInstallDomainNames",
// //
// // 			_domainNamesData: null,
// //
// // 			_refresh: function ( data ) {
// // 				this._domainNamesData = data;
// // 			},
// //
// // 			$update: function () {
// // 				this.$components = [
// // 					{
// // 						class: "clearfix",
// // 						$components: [
// // 							{	$type: "label", $text: "Domain names", class: "pull-left"	},
// // 							button( {icon: "fa fa-plus-square-o", text: "New", wrapperClass: "pull-right", onclick: "systemCertificatesInstallNew._live();" } ),
// // 						]
// // 					},
// // 					systemCertificatesInstall._domainNamesList(this._domainNamesData),
// // //								pp( { object: this._domainNamesData } ),
// // 				];
// //
// // 			},
// //
// // 			_remove: function( i ) {
// // 				this._domainNamesData.splice( i ,1 )
// // 			},
// //
// // 		};
// //
// // 	},
// //
// //
// // 	_domainNamesList: function (domains) {
// // 		return {
// // 			$components: domains.map( function( domain, i ) {
// // 				return {
// // 					id: "systemCertificatesInstallDomainName_" + domain.domain_name.replace( /\./g, "_" ),
// // 					$components: [
// // 						{ $type: "hr" },
// // 						dataList( { class: "dl-horizontal", items: [
// // 							{ label: "Domain name", data: domain.domain_name },
// // 							{ label: "Self-hosted", data: booleanText( domain.self_hosted ) },
// // 							{ label: "Internal only", data: booleanText( domain.internal_only ) },
// // 						] } ),
// // 						{
// // 							class: "clearfix",
// // 							$components: [
// // 								button( {
// // 									icon: "fa fa-edit",
// // 									text: "Edit",
// // 									wrapperClass: "pull-left",
// // 									onclick: function () {
// // 										systemCertificatesInstallEdit._live( domain );
// // 									}
// // 								}  ),
// // 								button( {
// // 									icon: "fa fa-trash-o",
// // 									text: "Delete",
// // 									wrapperClass: "pull-right",
// // 									onclick: function () {
// // //										if ( domain.domain_name.length ) {
// // 											if( confirm("Are you sure that you want to delete " + domain.domain_name + "?") ) {
// // 												systemCertificatesInstall._delete( i );
// // 											};
// // //										} else {
// // //
// // //										};
// // 									}
// // 								} ),
// // 							]
// // 						}
// // 					]
// // 				};
// // 			} )
// // 		};
// // 	},
// //
// // 	_delete: function ( i ) {
// // 		var domainName = systemCertificatesInstallDomainNames._domainNamesData[i].domain_name;
// // 		if ( systemCertificatesInstallDefault._defaultDomain == domainName ) {
// // 			alert("The default domain is " + domainName + ".\n\nYou will need to change the default domain before you can delete this domain name.")
// // 		} else {
// // 			apiRequest({
// // 				action: "/system/domains/names/" + domainName,
// // 				method: "delete",
// // 				callbacks: {
// // 					200: function() {
// // 						systemCertificatesInstallDomainNames._remove( i );
// // 					}
// // 				}
// // 			});
// // 		};
// // 	},
//
// };
