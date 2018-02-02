cell({
	id: "systemEmailDistributionList",

	_live: function (distribution_list_name) {

		// debugger;
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmailDistributionLists._live,
						content: {
							$components: [
								{ $type: "h4", $text: distribution_list_name },
							]
						}
					}),
					dataLoader({
						action: "/system/email/distribution_list",
						data: {
							distribution_list_name: distribution_list_name
						},
						render: function(data) {
							return {
								$components: [
									{ $type: "p", $text: data.description },
									{
										class: "clearfix",
										$components: [
											button({
												text: "Delete",
												icon: "fa fa-trash-o",
												wrapperClass: "pull-right",
												onclick: function () {
													if ( data.email_addresses.length ) {
														alert("Remove all email addresses first.");
													} else {
														if ( confirm("Are you sure that you want to delete this distribution list?") ) {
															apiRequest({
																action: "/system/email/distribution_list",
																method: "DELETE",
																data: {
																	distribution_list_name: distribution_list_name
																},
																callbacks: {
																	200: systemEmailDistributionLists._live
																}
															});
														};
													};
												}
											}),
											button({
												text: "Edit",
												icon: "fa fa-edit",
												wrapperClass: "pull-left",
												onclick: function () {
													systemEmailDistributionListEdit._live( distribution_list_name );
												}
											}),
										]
									},
									hr(),
									{ $type: "label", $text: "Email addresses" },
									{
										class: "clearfix",
										$components: [
											button({
												wrapperClass: "pull-left",
												icon: "fa fa-plus-square-o",
												text: "Add",
												onclick: function () {
													systemDistributionListEmailAddressesAdd._live(distribution_list_name);
												},
											}),
											data.email_addresses.length ? button({
												wrapperClass: "pull-right",
												icon: "fa fa-minus-square-o",
												text: "Remove",
												onclick: function () {
													systemDistributionListEmailAddressDelete._live(distribution_list_name);
												},
											}) : {},
										]
									},
									{
										$type: "ul",
										$components: data.email_addresses.map( function( email_address ) {
											return { $type: "li", $text: email_address };
										})
									}
								]
							};
						}
					}),
				]
			}
		} );

	}

});
