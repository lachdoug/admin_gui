var $appNetworkEdit = {

	$cell: true,
	id: "appNetworkEdit",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-sitemap", text: "App network edit" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appNetworkEdit._appName },
						{ $type: "hr" },
						{
							id: "appNetworkEditForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function () {
								this.$components = [ appNetworkEdit._form() ];
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
			action: "/apps/" + this._appName + "/network",
			callbacks: {
				200: function(response) {
					appNetworkEdit._data = response
					appNetworkEditForm._refresh();
				},
			}
		});
	},


	_form: function () {
		var data = appNetworkEdit._data;
		return form ( {
			components: [
				formField( {
					type: "select",
					name: "data[http_protocol]",
					label: "HTTP Protocol",
					collection: availableHttpProtocols( data.default_http_protocol ),
					value: data.http_protocol
				}),
				formField( {
					id: "appNetworkEditFormField_host_name",
					name: "data[host_name]",
					label: "Host name",
					value: data.host_name,
					onchange: appNetworkEdit._checkFqdnReserved,
				}),
				formField( {
					id: "appNetworkEditFormField_domain_name",
					type: "select",
					name: "data[domain_name]",
					label: "Domain name",
					value: data.domain_name,
					collection: data.available_domain_names,
					onchange: appNetworkEdit._checkFqdnReserved,
				} ),
				formCancel ( { onclick: () => { appNetwork._live( appNetworkEdit._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/network",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appNetwork._live( appNetworkEdit._appName );
				},
			}
		});

	},

	_checkFqdnReserved: function () {
		// var data = appNetworkEdit._data;
		
		var fqdn = $("#appNetworkEditFormField_host_name").val() + '.' + $("#appNetworkEditFormField_domain_name").val();
		if( $.inArray( fqdn, appNetworkEdit._data.reserved_fqdns ) > -1 ) {
			$("#appNetworkEditFormField_host_name")[0].setCustomValidity(
				fqdn + " is already in use."
			);
		} else {
			$("#appNetworkEditFormField_host_name")[0].setCustomValidity('')
		};
	},



};
