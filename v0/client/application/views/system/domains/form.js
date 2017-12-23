var $systemDomainsNamesForm = {

	$cell: true,
	id: "systemDomainsNamesForm",

	_form: function( data ) {

    var isEditForm = data ? true : false;
    var method = isEditForm ? "PUT" : "POST";
    var action = isEditForm ? "/system/domains/names/" + data.domain_name : "/system/domains/names";
    data = isEditForm ? data : {};

		return form( {
			components: [
				formField( {
					name: "data[domain_name]",
					id: "systemDomainsNamesFormField_domain_name",
					required: true,
					label: "Domain name",
          disabled: isEditForm,
    			value: data.domain_name
				} ),
				formField( {
					type: "checkbox",
					name: "data[self_hosted]",
					id: "systemDomainsNamesFormField_self_hosted",
					label: "Self-hosted",
    			value: data.self_hosted,
				} ),
				formField( {
					type: "checkbox",
					name: "data[internal_only]",
					id: "systemDomainsNamesFormField_internal_only",
					label: "Internal only",
    			value: data.internal_only,
					dependOn: {
						input: "systemDomainsNamesFormField_self_hosted",
						property: "checked"
					}
				} ),
				formCancel ( {
					onclick: function () {
						systemDomains._live();
					}
				} ),
				formSubmit(),
			],
			action: action,
			method: method,
			callbacks: {
				200: function(response) {
					systemDomains._live();
				},
			}
		} );

	},

};
