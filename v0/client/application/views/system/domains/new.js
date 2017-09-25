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
// 						form( {
// 							components: [
// 								formField( {
// 									name: "data[domain_name]",
// 									id: "systemDomainsNewField_domain_name",
// 									label: "Domain name",
// 								} ),
// 								formField( {
// 									type: "checkbox",
// 									name: "data[self_hosted]",
// 									id: "systemDomainsNewField_self_hosted",
// 									label: "Self-hosted",
// 								} ),
// 								formField( {
// 									type: "checkbox",
// 									name: "data[internal_only]",
// 									id: "systemDomainsNewField_internal_only",
// 									label: "Internal only",
// 									dependOn: {
// 										input: "systemDomainsNewField_self_hosted",
// 										property: "checked"
// 									}
// 								} ),
// 								formCancel ( {
// 									onclick: function () {
// 										systemDomains._live();
// 									}
// 								} ),
// 								formSubmit(),
// 							],
// 							action: "/system/domains/names",
// //							method: 'PUT',
// 							callbacks: {
// 								200: function(response) {
// 									systemDomains._live();
// 								},
// 							}
// 						} )
					]
				}
			}
		);
	},


};
