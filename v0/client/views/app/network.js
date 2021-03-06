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
				header: icon( { icon: "fa fa-sitemap", text: "App network" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appNetwork._appName ); }
								} ),
								{ $type: "h4", $text: appNetwork._appName },
							]
						},
						{ $type: "hr" },
						{
							id: "appNetworkContent",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function ( data ) {
								this.$components = [ appNetwork._network( data ) ];
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
					appNetworkContent._refresh(response);
				},
			}
		});
	},


	_network: function ( data ) {
		return {
			$components: [
				dataList({
					class: "dl-horizontal",
					items: [
						{ label: "HTTP Protocol", data: data.http_protocol },
						{ label: "Host name", data: data.host_name },
						{ label: "Domain name", data: data.domain_name },
					]
				}),
				button( {
					icon: "fa fa-edit",
					text: "Edit",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () { appNetworkEdit._live( appNetwork._appName ); },
				} ),
			]
		};

	},

};
