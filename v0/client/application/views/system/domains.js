var $systemDomains = {

	$cell: true,
	id: "systemDomains",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "Domains" } ),
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
							$components: [
								systemDomains._zeroconf(),
								systemDomains._defaultDomain(),
								systemDomains._domainNames(),
							],
						}
					]
				}
			}
		);
		this._load();
	},


	_load: function () {
		apiRequest({
			action: "/system/domains",
			callbacks: {
				200: function( data ) {
					systemDomainsZeroconf._refresh( data.zeroconf );
					systemDomainsDefault._refresh( data.default );
					systemDomainsDomainNames._refresh( data.names );
				},
			}
		});
	},


	_zeroconf: function () {
		return {

			id: "systemDomainsZeroconf",
			_zeroconfEnabled: null,

			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ),
			],

			_refresh: function( zeroconfEnabled ) {
				this._zeroconfEnabled = zeroconfEnabled
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{
								class: "pull-left",
							 	$components: [
									{ $type: "label", $text: "Avahi (zeroconf)" },
									{ $components: [
										this._zeroconfEnabled ?
											icon( { icon:"fa fa-check", text:"local domain is enabled" } ) :
											icon( { icon:"fa fa-times", text:"local domain is disabled" } ),
									] },
								]
							},
							button( this._zeroconfEnabled ?
						 		{icon: "fa fa-toggle-on", text: "Disable", wrapperClass: "pull-right", onclick: "systemDomains._disableZeroconf();" } :
						 		{icon: "fa fa-toggle-off", text: "Enable", wrapperClass: "pull-right", onclick: "systemDomains._enableZeroconf();" } ),
						]
					},
					{
						$type: "hr",
						style: "border-top: 2px solid #eee;"
					},
				];
			},
		};

	},


	_disableZeroconf: function () {
		if ( systemDomainsDefault._defaultDomain == "local" ) {
			alert("The default domain is local, which is provided by Avahi.\n\nYou will need to change the default domain before you can disable Avahi.")
		} else {
			apiRequest({
				action: "/system/domains/zeroconf",
				method: "delete",
				callbacks: {
					200: function() {
						systemDomainsZeroconf._refresh(false)
					}
				}
			});
		};
	},


	_enableZeroconf: function () {
		apiRequest({
			action: "/system/domains/zeroconf",
			method: "put",
			callbacks: {
				200: function() {
					systemDomainsZeroconf._refresh(true);
				}
			}
		});
	},


	_defaultDomain: function () {
		return {
			id: "systemDomainsDefault",
			_defaultDomain: null,

			_refresh: function( defaultDomain ) {
				this._defaultDomain = defaultDomain
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{
								class: "pull-left",
							 	$components: [
									{	$type: "label", $text: "Default domain"	},
									{ $text: this._defaultDomain },
								]
							},
							button( {icon: "fa fa-edit", text: "Edit", wrapperClass: "pull-right", onclick: "systemDomainsDefaultEdit._live();" } ),
						]
					},
					{
						$type: "hr",
						style: "border-top: 2px solid #eee;"
					},
				];
			},
		};

	},


	_domainNames: function () {
		return {
			id: "systemDomainsDomainNames",

			_domainNamesData: null,

			_refresh: function ( data ) {
				this._domainNamesData = data;
			},

			$update: function () {
				this.$components = [
					{
						class: "clearfix",
						$components: [
							{	$type: "label", $text: "Domain names", class: "pull-left"	},
							button( {icon: "fa fa-plus", text: "Add", title: "Add a new domain name", wrapperClass: "pull-right", onclick: "systemDomainsNew._live();" } ),
						]
					},
					systemDomains._domainNamesList(this._domainNamesData),
//								pp( { object: this._domainNamesData } ),
				];

			},

			_remove: function( i ) {
				this._domainNamesData.splice( i ,1 )
			},

		};

	},


	_domainNamesList: function (domains) {
		return {
			$components: domains.map( function( domain, i ) {
				return {
					id: "systemDomainsDomainName_" + domain.domain_name.replace( /\./g, "_" ),
					$components: [
						{ $type: "hr" },
						dataList( { class: "dl-horizontal", items: [
							{ label: "Domain name", data: domain.domain_name },
							{ label: "Self-hosted", data: booleanText( domain.self_hosted ) },
							{ label: "Internal only", data: booleanText( domain.internal_only ) },
						] } ),
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-edit",
									text: "Edit",
									wrapperClass: "pull-left",
									onclick: function () {
										systemDomainsEdit._live( domain );
									}
								}  ),
								button( {
									icon: "fa fa-trash-o",
									text: "Delete",
									wrapperClass: "pull-right",
									onclick: function () {
//										if ( domain.domain_name.length ) {
											if( confirm("Are you sure that you want to delete " + domain.domain_name + "?") ) {
												systemDomains._delete( i );
											};
//										} else {
//
//										};
									}
								} ),
							]
						}
					]
				};
			} )
		};
	},

	_delete: function ( i ) {
		var domainName = systemDomainsDomainNames._domainNamesData[i].domain_name;
		if ( systemDomainsDefault._defaultDomain == domainName ) {
			alert("The default domain is " + domainName + ".\n\nYou will need to change the default domain before you can delete this domain name.")
		} else {
			apiRequest({
				action: "/system/domains/names/" + domainName,
				method: "delete",
				callbacks: {
					200: function() {
						systemDomainsDomainNames._remove( i );
					}
				}
			});
		};
	},

};
