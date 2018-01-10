cell({

	id: "appMemory",

	// _appName: null,

	_live: function (appName) {

		this._appName = appName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "App memory" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appControlPanel._live( appMemory._appName ); }
								} ),
								{ $type: "h4", $text: appMemory._appName },
							]
						},
						{ $type: "hr" },
						appMemory._memoryUsage(),
						{ $type: "hr" },
						appMemory._memoryAllocated(),
					]
				}
			}
		);
		this._load();
	},


	_load: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/memory",
			callbacks: {
				200: function(response) {
					appMemoryAllocated._refresh(response);
				},
			}
		});

	},

	_memoryUsage: function () {

		var appName = this._appName;

		return {
			id: "appMemoryUsage",

			$components: [
				button( {
					icon: "fa fa-pie-chart",
					text: "Usage",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () {
						appMemoryUsage.$components = [
							{ $type: "p", $components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							] }
						];
						appMemoryUsage._load();
					}
				} )
			],

			_load: function () {

				apiRequest({
					action: '/system/statistics/container_memory',
					callbacks: {
						200: function(response) {
							appMemoryUsage._refresh( response );
						},
					}
				});

			},



			_refresh: function( data ) {

				var appMemoryUsageData = data.containers.applications[appName];

				this.$components = [
					appMemoryUsageData && appMemoryUsageData.current ? dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Current", data: (appMemoryUsageData.current/1024/1024).toFixed(1) + " MB" },
							{ label: "Peak", data: (appMemoryUsageData.maximum/1024/1024).toFixed(1) + " MB" },
						]
					} ) :
					{ $type: "i", $text: "No memory usage."},
				];
			}

		};
	},


	// _memoryUsage: function () {
	//
	// 	var appName = this._appName;
	//
	// 	return {
	// 		id: "appMemoryUsage",
	//
	// 		$components: [
	// 			icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
	// 		],
	//
	// 		_refresh: function( data ) {
	//
	// 			var appMemory = data.containers.applications[appName];
	//
	// 			this.$components = [
	// 				appMemory && appMemory.current ? dataList( {
	// 					class: "dl-horizontal",
	// 					items: [
	// 						{ label: "Current", data: (appMemory.current/1024/1024).toFixed(1) + " MB" },
	// 						{ label: "Peak", data: (appMemory.maximum/1024/1024).toFixed(1) + " MB" },
	// 					]
	// 				} ) :
	// 				{ $type: "i", $text: "No memory usage."},
	// 			];
	// 		}
	//
	// 	};
	// },

	_memoryAllocated: function () {

		var appName = this._appName;

		return {
			id: "appMemoryAllocated",

			$components: [
				icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
			],

			_refresh: function( data ) {
				this.$components = [
					dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Allocated", data: data.memory + " MB" },
						]
					} ),
					button({
						wrapperClass: "clearfix",
						class: "pull-right-md",
						icon: "fa fa-edit",
						text: "Edit",
						onclick: function () { appMemoryEdit._live( appName ); }
					})
				];
			}

		};
	},


});
