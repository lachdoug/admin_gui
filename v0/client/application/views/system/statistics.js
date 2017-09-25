var $systemStatistics = {

	$cell: true,
	id: "systemStatistics",


	_live: function() {
		modal._live(
			{
				dialogClass: "modal-lg",
				header: icon( { icon: "fa fa-bar-chart", text: "System statistics" } ),
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
								button( { onclick: systemStatistics._live,
									icon: "fa fa-repeat", text: "Refresh" }
								),
							]
						},
						{
							id: "systemStatisticsCharts",
							$components: [
								icon( { icon: "fa fa-spinner fa-spin", text: "Loading..." } )
							],
							_refresh: function (statisticsData) {
								this.$components = [ systemStatistics._charts(statisticsData) ];
							},
						}
					]
				}
			}
		);
		this._loadStatistics();
	},


	_loadStatistics: function () {
		apiRequest({
			action: "/system/statistics",
			callbacks: {
				200: function(response) {
					systemStatisticsCharts._refresh(response);
				},
			}
		});
	},

	_charts: function( statisticsData  ) {
		var chartsData = this._chartDataCalculator( statisticsData );
		return {
			class: "row",
			$components: [

				this._chart( {
					label: "System memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["systemMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Memory totals",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["totalsMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Apps memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["appsMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Services memory",
					mdCols: 6,
					chart: {
						type: 'doughnut',
						data: chartsData["servicesMemory"],
						options: {
							legend: { display: true, position: 'right', responsive: true, }
						},
					},
				} ),

				this._chart( {
					label: "Memory totals allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["totalsMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: 100
					}
				} ),

				this._chart( {
					label: "Apps memory allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["appsMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: chartsData["appsMemoryAllocations"].labels.length * 20 + 60
					}
				} ),

				this._chart( {
					label: "Services memory allocation",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["servicesMemoryAllocations"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							tooltips: { callbacks: { label: function(tooltipItem, data) {
								var memory_total = data.memoryLimits[tooltipItem.index];
								var memory_current_data = data.datasets[0].data[tooltipItem.index];
								var memory_peak_data = data.datasets[1].data[tooltipItem.index];
								var memory_current = ( memory_current_data * memory_total ).toFixed(1);
								var memory_peak = ( ( memory_current_data + memory_peak_data ) * memory_total ).toFixed(1);
								var memory_headroom = ( memory_total - memory_peak ).toFixed(1);
								if (tooltipItem.datasetIndex == 0) {
										return "Current: " + memory_current + "MB";
									} else if (tooltipItem.datasetIndex == 1) {
										return "Peak: " + memory_peak + "MB";
									} else {
										return "Allocated: " + memory_total + "MB, Headroom: " + memory_headroom + "MB";
									};
								 } } },
							scales: { xAxes: [ { stacked: true, ticks: { callback: function(value) { return Math.round(value * 100) + "%" } } } ], yAxes: [ { stacked: true } ] },
						},
					},
					canvas: {
						height: chartsData["servicesMemoryAllocations"].labels.length * 20 + 60
					}
				} ),

				this._chart( {
					label: "CPU queue",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["cpuQueue"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							legend: false,
							scales: { xAxes: [ { ticks: { beginAtZero: true } } ] },
						},
					},
					canvas: {
						height: 100
					}
				} ),

				this._chart( {
					label: "Network activity",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["networkActivity"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							scales: { xAxes: [ {  scaleLabel: { display: true, labelString: 'MB' } } ] },
						},
					},
					canvas: {
						height: chartsData["networkActivity"].labels.length * 50 + 60
					}
				} ),

				this._chart( {
					label: "Disks",
					mdCols: 12,
					chart: {
						type: 'horizontalBar',
						data: chartsData["disksUsage"],
						options: {
							maintainAspectRatio: false,
							responsive: true,
							scales: { xAxes: [ { display: false, stacked: true } ], yAxes: [ { stacked: true } ] },
							tooltips: {
								callbacks: {
									label: function(tooltipItem, data) {
                		var diskSize = data.diskSizes[tooltipItem.index];
                		if (tooltipItem.datasetIndex == 0) {
                    	return "Used: " + ( data.datasets[0].data[tooltipItem.index] * diskSize ).toFixed(1) + "GB";
                  	} else {
                    	return "Free: " + ( data.datasets[1].data[tooltipItem.index] * diskSize ).toFixed(1) + "GB";
                  	};
                 	}
								}
							},
						},
					},
					canvas: {
						height: chartsData["disksUsage"].labels.length * 20 + 40
					}
				} ),

			]
		}
	},


	_chart: function ( chartData ) {

		return {
			class: "col-sm-12 col-md-" + chartData.mdCols,
			$components: [
				{ $type: "label", $text: chartData.label },
				{
					style: "min-width: 400px; " + ( dig( chartData, "canvas", "height" ) ? "height: " + chartData.canvas.height + "px;" : null ),
					$components: [
						{
							$type: "canvas",
							$init: function () {
								new Chart( this, chartData.chart );
							},
						},
					]
				}
			]
		};

	},


	_chartDataCalculator: function (systemStatistics) {

		var stats = systemStatistics;

		var colors = function (numberOfColors) {
			var palette = [
				'#48D', // Engines blue
				'#F1AD4D', // orange
				'#999999', // grey
				'#89bf06', // green
				'#8A6EAF', // purple
				'#EFDA43', // yellow
				'#EE3434', // red
				"#A630AC", "#3650A0", "#9F1D6D", "#80C837", "#1C167A", "#A012AA",
				"#DSES9F6E", "#C11C17", "#60B6CA", "#3EE61A", "#DE5003", "#4CA82B",
				"#EFCE10", "#E27A1D", "#7F91C3", "#434187", "#228B22", "#502E72", // loads of other colors for the skinny slices
				"#575597", "#3B256D", "#A63570", "#E6AA19", "#A670B8", "#93BDE7",
				"#6F6DA7", "#A6358C", "#A2395B"
			];
			if ( numberOfColors <= palette.length ) {
				return palette.slice(0, numberOfColors);
			} else {
				for (i = 1; i < ( numberOfColors - palette.length ); i++) {
					palette.push( '#'+Math.random().toString(16).slice(-6) )
				};
				return palette;
			};
		};

		var memoryFor = function (containerType) {

			var labels = [];
			var data = [];
			var appsData = stats.container_memory_statistics.containers[containerType];
			var appsDataResult = [];

			for (var appName in appsData) {
				appsDataResult.push( [ appName, appsData[appName] ] );
			};
			appsDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			appsDataResult.forEach(function( app ) {
				var memory = app[1].current/1048576;
				if ( memory < 0 ) { memory = 0; };
				labels.push( "" + app[0] + " " + memory.toFixed(1) + "MB" );
				data.push( memory );
			} );

			if ( data.length > 17 ) {
				var othersData = data.slice( 17, -1).reduce(function (a, b) {
					return a + b;
				});
				var othersLabel = "" +
						labels.slice( 17, -1 ).length +
						" " +
						( labels.slice( 17, -1 ).length == 1 ? "other" : "others" ) +
						" " +
						othersData.toFixed(1) +
						"MB";
				labels = labels.slice( 0,17 );
				labels.push( othersLabel );
				data = data.slice( 0, 17 );
				data.push( othersData );
			};

			return {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors(data.length)
					}
				]
			};
		};

		var memoryAllocationsFor = function (containerType) {
			var containerNames = [];
			var currents = [];
			var peaks = [];
			var headrooms = [];
			var limits = [];
			var containersData = stats.container_memory_statistics.containers[containerType];

			var containersDataResult = [];

			for (var containerName in containersData) {
				containersDataResult.push( [ containerName, containersData[containerName] ] );
			};
			containersDataResult.sort(function(a, b) {
					return ( ( b[1].current / b[1].limit ) -  ( a[1].current / a[1].limit ) );
			});

			containersDataResult.forEach( function( container ) {
				var current = container[1].current;
				var maximum = container[1].maximum;
				var limit = container[1].limit;
				limits.push( limit/1048576 );
				containerNames.push( "" + container[0] + " " + limit/1048576 + "MB" );
				currents.push( current/limit );
				peaks.push( (maximum - current)/limit );
				headrooms.push( (limit - maximum)/limit );
			} );

			return {
				labels: containerNames,
				memoryLimits: limits,
				datasets:
					[ {label: 'Current', data: currents, backgroundColor: colors(3)[0] },
						{label: 'Peak', data: peaks, backgroundColor: colors(3)[1] },
						{label: 'Allocated', data: headrooms, backgroundColor: colors(3)[2] } ]
			};
		};

		var totalsMemory = function () {
			totals = stats.container_memory_statistics.containers.totals;
			applications = totals.applications.allocated/1048576;
			services = totals.services.allocated/1048576;
			return {
				labels: [ "Apps " + applications + "MB", "Services " + services + "MB" ],
				datasets: [ { data: [ applications, services ], backgroundColor: colors(2) } ]
			};
		};

		var totalsMemoryAllocations = function () {
			var labels = []
			var currents = []
			var peaks = []
			var headrooms = []
			var limits = []
			var groupsData = stats.container_memory_statistics.containers.totals;

			var groupsDataResult = [];

			for (var groupName in groupsData) {
				groupsDataResult.push( [ groupName, groupsData[groupName] ] );
			};

			groupsDataResult.forEach( function( group ) {
				group[0] = ( group[0] == "applications" ? "Apps" : "Services" );
				var current = group[1].in_use;
				var maximum = group[1].peak_sum;
				var limit = group[1].allocated;
				limits.push( limit/1048576 );

				labels.push( "" + group[0] + " " + limit/1048576 + "MB" );
				currents.push( current/limit );
				peaks.push( (maximum - current)/limit );
				headrooms.push( (limit - maximum)/limit );
			} );

			return {
				labels: labels,
				memoryLimits: limits,
				datasets:
					[ {label: 'Current', data: currents, backgroundColor: colors(3)[0] },
						{label: 'Peak', data: peaks, backgroundColor: colors(3)[1] },
						{label: 'Allocated', data: headrooms, backgroundColor: colors(3)[2] } ]
			};

		};

		var systemMemory = function () {
			total = stats.system_memory_statistics.total/1024;
			active = stats.system_memory_statistics.active/1024;
			buffers = stats.system_memory_statistics.buffers/1024;
			file_cache = stats.system_memory_statistics.file_cache/1024;
			free = stats.system_memory_statistics.free/1024;
			other = total - active - buffers - file_cache - free;
			if ( other < 0 ) { other = 0 };
			labels = 	[ "Active " + active.toFixed(1) + "MB",
									"Buffers " + buffers.toFixed(1) + "MB",
									"File cache " + file_cache.toFixed(1) + "MB",
									"Free " + free.toFixed(1) + "MB",
									"Other " + other.toFixed(1) + "MB" ];
			data = [active, buffers, file_cache, free, other];
			return { labels: labels, datasets: [ { data: data, backgroundColor: colors(5) }] };
		};

		var cpuQueue = function () {
				return {
					labels: [ "One min " + stats.cpu_statistics.one,
										"Five mins " + stats.cpu_statistics.five,
										"Fifteen mins " + stats.cpu_statistics.fifteen ],
					datasets:
						[ {
							data: [
								stats.cpu_statistics.one,
								stats.cpu_statistics.five,
								stats.cpu_statistics.fifteen
							],
							backgroundColor: colors(3)
						} ]
				};
		};

		var networkActivity = function () {
			var labels = [];
			var dataRx = [];
			var dataTx = [];

			var networkActivityData = stats.network_statistics;
			var networkActivityDataResult = [];

			for (var networkInterfaceName in networkActivityData) {
				networkActivityDataResult.push( [
					networkInterfaceName,
					networkActivityData[networkInterfaceName] ] );
			};
			networkActivityDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			networkActivityDataResult.forEach( function ( networkInterface ) {
				labels.push( networkInterface[0] );
				dataRx.push( networkInterface[1].rx / 1048576 );
				dataTx.push( networkInterface[1].tx / 1048576 );
			} );

			return {
				labels: labels,
				datasets: [
					{ label: 'Received', data: dataRx, backgroundColor: colors(2)[0] },
					{ label: 'Sent', data: dataTx, backgroundColor: colors(2)[1] }
				]
			};

		};

		var disksUsage = function () {
			var labels = [];
			var disksFree = [];
			var disksUsed = [];
			var disksSizes = [];

			var disksUsageData = stats.disk_statistics;
			var disksUsageDataResult = [];

			for (var diskName in disksUsageData) {
				disksUsageDataResult.push( [ diskName, disksUsageData[diskName] ] );
			};
			disksUsageDataResult.sort(function(a, b) {
					return b[1].current - a[1].current;
			});

			disksUsageDataResult.forEach( function ( disk ) {
				var diskSize = disk[1].blocks / 2097152;
				var diskFree = disk[1].available / 2097152;
				var diskUsed = diskSize - diskFree;
				var diskLabel = disk[0] + disk[1].type + " " + disk[1].mount + " " + diskSize.toFixed(0) + "GB";
				labels.push( diskLabel );
				disksFree.push( diskFree / diskSize );
				disksUsed.push( diskUsed / diskSize );
				disksSizes.push( diskSize );
			} );

			return {
				labels: labels,
				diskSizes: disksSizes,
				datasets: [
					{ label: 'Used', data: disksUsed, backgroundColor: colors(2)[0] },
					{ label: 'Free', data: disksFree, backgroundColor: colors(2)[1] }
				]
			};
		};

		return {
			totalsMemory: totalsMemory(),
			systemMemory: systemMemory(),
			appsMemory: memoryFor("applications"),
			appsMemoryAllocations: memoryAllocationsFor("applications"),
			servicesMemory: memoryFor("services"),
			servicesMemoryAllocations: memoryAllocationsFor("services"),
			totalsMemoryAllocations: totalsMemoryAllocations(),
	// TODO:			cpuLoad: cpuLoad(),
			cpuQueue: cpuQueue(),
			networkActivity: networkActivity(),
			disksUsage: disksUsage(),
		};
	},

};
