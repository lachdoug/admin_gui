var $appNetwork = {

	$cell: true,
	id: "appNetwork",

	_appName: null,


	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-sitemap", text: "Network" } ),
				body: {
					$components: [
						{ $type: "h4", $text: appNetwork._appName },
						{ $type: "hr" },
						{
							id: "appNetworkForm",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appNetwork._form( data ) ];
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
					appNetworkForm._refresh(response);
				},
			}
		});
	},


	_form: function ( data ) {
		return form ( {
			components: [
				formField( {
					type: "select",
					name: "form[http_protocol]",
					label: "HTTP Protocol",
					collection: availableHttpProtocols( data.default_http_protocol ),
					value: data.http_protocol
				}),
				formField( {
					name: "form[host_name]",
					label: "Host name",
					value: data.host_name
				}),
				formField( {
					type: "select",
					name: "form[domain_name]",
					label: "Domain name",
					value: data.domain_name,
					collection: data.available_domain_names
				} ),
				formCancel ( { onclick: () => { appControlPanel._live( appNetwork._appName ); } } ),
				formSubmit(),
			],
			action: "/apps/" + this._appName + "/network",
			method: 'PUT',
			callbacks: {
				200: function(response) {
					appControlPanel._live( appNetwork._appName );
				},
			}
		});

	},

};
