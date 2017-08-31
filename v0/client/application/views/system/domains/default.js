var $systemDomainsDefaultEdit = {
	
	$cell: true,
	id: "systemDomainsDefaultEdit",
	
	
	_live: function( defaultDomain ) {
		$$("#modal")._live(
			{
				header: icon( { icon: "fa fa-star-o", text: "Default domain" } ),
				body: {
					$components: [
						{
							id: "systemDomainsDefaultEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } ) 
							],
							_refresh: function( data ) {
								this.$components = [ systemDomainsDefaultEdit._form( data ) ];
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
			action: "/system/domains",
			callbacks: {
				200: function(response) {
					systemDomainsDefaultEditForm._refresh(response);
				},
			}
		});
	},

	
	_form: function (data) {

		var namesCollection = data.names.map( function( domain ) { return domain.domain_name } );
		if ( data.zeroconf ) {
			namesCollection.push( "local" );
		};

//debugger		
		
		
		return form ( {
			components: [
				formField( {
					type: "select", 
					name: "form[default_domain]", 
					id: "systemDomainsDefaultEditField_default_domain", 
					label: "Default domain",
					value: data.default,
					collection: namesCollection,
				} ),
				formCancel ( { onclick: "systemDomains._live();" } ),
				formSubmit(),
//				pp( { object: data } )
			],
			action: "/system/domains/default",
			method: "PUT",
			callbacks: {
				200: function(response) {
					systemDomains._live();
				},
			}
		});
		
	},
	
};
