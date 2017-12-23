var $systemDomainsNew = {

	$cell: true,
	id: "systemDomainsNew",


	_live: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-globe", text: "New domain name" } ),
				body: {
					$components: [
						systemDomainsNamesForm._form()
					]
				}
			}
		);
	},


};
