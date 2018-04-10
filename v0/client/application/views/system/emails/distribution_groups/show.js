cell({
	id: "systemEmailDistributionGroup",

	_live: function (distribution_group_name) {

		// debugger;
		modal._live ( {
			header: icon( { icon: "fa fa-share-square-o", text: "System distribution group" } ),
			body: {
				$components: [
					modalNav({
						up: systemEmailDistributionGroups._live,
						content: {
							$components: [
								{ $type: "h4", $text: distribution_group_name },
							]
						}
					}),
					dataLoader({
						action: "/system/email/distribution_groups/",
						params: {
							name: distribution_group_name
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
														if ( confirm("Are you sure that you want to delete this distribution group?") ) {
															apiRequest({
																action: "/system/email/distribution_groups/",
																method: "DELETE",
																params: {
																	name: distribution_group_name
																},
																callbacks: {
																	200: systemEmailDistributionGroups._live
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
													systemEmailDistributionGroupEdit._live( distribution_group_name );
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
													systemDistributionGroupEmailAddressesAdd._live(distribution_group_name);
												},
											}),
											data.email_addresses.length ? button({
												wrapperClass: "pull-right",
												icon: "fa fa-minus-square-o",
												text: "Remove",
												onclick: function () {
													systemDistributionGroupEmailAddressDelete._live(distribution_group_name);
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
