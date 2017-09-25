var $systemExceptionReporting = {

	$cell: true,
	id: "systemExceptionReporting",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-bug", text: "Bugs" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									onclick: systemControlPanel._live,
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right"
								} ),
							]
						},
						{
							class: "clearfix",
							$components: [
								{
									class: "pull-left",
									$components: [
										{ $type: "label", $text: "Bug reports" },
										{ $components: [
											system._data.report_exceptions ?
												icon( { icon:"fa fa-check", text:"Send bug reports" } ) :
												icon( { icon:"fa fa-times", text:"Do not send bug reports" } ),
										] },
									]
								},
								button( system._data.report_exceptions ?
									{ icon: "fa fa-toggle-on", text: "Disable", wrapperClass: "pull-right", onclick: systemExceptionReporting._disable } :
									{ icon: "fa fa-toggle-off", text: "Enable", wrapperClass: "pull-right", onclick: systemExceptionReporting._enable } ),
							]
						}
					],
				}
			}
		);
	},


	_disable: function() {
		apiRequest({
			action: "/system/exception_reporting",
			method: "delete",
			callbacks: {
				200: function() {
					var system_data = system._data;
					system_data.report_exceptions = false;
					system._data = system_data;
					systemExceptionReporting._live();
				}
			}
		});
	},

	_enable: function() {
		apiRequest({
			action: "/system/exception_reporting",
			method: "put",
			callbacks: {
				200: function() {
					var system_data = system._data;
					system_data.report_exceptions = true;
					system._data = system_data;
					systemExceptionReporting._live();
				}
			}
		});
	},


};
