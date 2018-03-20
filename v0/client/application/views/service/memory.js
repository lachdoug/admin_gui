cell({

	id: "serviceMemory",

	_serviceName: null,


	_live: function (serviceName) {

		this._serviceName = serviceName;
		this._show();

	},


	_show: function () {
		modal._live(
			{
				header: icon( { icon: "fa fa-microchip", text: "Service memory" } ),
				body: {
					$components: [
						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceControlPanel._live( serviceMemory._serviceName ); }
								} ),
								{ $type: "h4", $text: serviceMemory._serviceName },
							]
						},
						{ $type: "hr" },
						serviceMemory._memoryUsage(),
						{ $type: "hr" },
						serviceMemory._memoryAllocated(),
					]
				}
			}
		);
		this._load();
	},


	_load: function () {

		apiRequest({
			action: "/services/" + this._serviceName + "/memory",
			callbacks: {
				200: function(response) {
					serviceMemoryAllocated._refresh(response);
				},
			}
		});

	},


	_memoryUsage: function () {

		var serviceName = this._serviceName;

		return {
			id: "serviceMemoryUsage",

			$components: [
				button( {
					icon: "fa fa-pie-chart",
					text: "Usage",
					wrapperClass: "clearfix",
					class: "pull-right-md",
					onclick: function () {
						serviceMemoryUsage.$components = [
							{ $type: "p", $components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							] }
						];
						serviceMemoryUsage._load();
					}
				} )
			],

			_load: function () {

				apiRequest({
					action: '/system/statistics/container_memory',
					callbacks: {
						200: function(response) {
							serviceMemoryUsage._refresh( response );
						},
					}
				});

			},



			_refresh: function( data ) {

				var serviceMemory = data.containers.services[serviceName];

				this.$components = [
					serviceMemory && serviceMemory.current ? dataList( {
						class: "dl-horizontal",
						items: [
							{ label: "Current", data: (serviceMemory.current/1024/1024).toFixed(1) + " MB" },
							{ label: "Peak", data: (serviceMemory.maximum/1024/1024).toFixed(1) + " MB" },
						]
					} ) :
					{ $type: "i", $text: "No memory usage."},
				];
			}

		};
	},

	_memoryAllocated: function () {

		var serviceName = this._serviceName;

		return {
			id: "serviceMemoryAllocated",

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
						onclick: function () { serviceMemoryEdit._live( serviceName ); }
					})
				];
			}

		};
	},


});
