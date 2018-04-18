var $systemDomainsEdit = {

	$cell: true,
	id: "systemDomainsEdit",


	_live: function ( data ) {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "Edit domain name" } ),
				body: {
					$components: [
						systemDomainsNamesForm._form( data )
					]
				}
			}
		);
	},

};
