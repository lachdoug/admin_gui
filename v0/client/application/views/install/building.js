var $installBuilding = {

	$cell: true,
	id: "installBuilding",

	_builderLogEventSource: null,
	_appName: null,

	_live: function () {

		this._appName = system._systemData.builder.current.engine_name;

		modal._live ( {
			dialogClass: "modal-lg",
			header: icon({icon: "fa fa-plus", text: "Building app"}),
			body: {
				$components: [
					{ $type: "h4", $text: installBuilding._appName },
					progressBar( { id: "installBuildingProgress" } ),
					{
						id: "installBuildingComplete",
						style: "display: none;",
						$components: [
							{
								id: "installBuildingCompleteBuildReport",
								$components: [
									icon ( { icon: "fa fa-spinner fa-spin", text: "Loading build report" } )
								],
								_render: function (report) {
									report = report.replace(/^\s+|\s+$/g, '');
									if ( report == "" ) {
										report = { $type: "i", $text: "This app does not have a build report." };
									} else {
										debugger
										// alert( "report: " + encode(report) + "\n\nlength: " + report.length);
										report = markdown( report );
									}
									this.$components = [
										button( {
											icon: "fa fa-times",
											wrapperClass: "clearfix",
											class: "pull-right",
											text: "Close",
											onclick: function () { modal._kill(); }
										} ),
										{ $type: "hr" },
										report
									];
								}
							},
							// { $type: "p", $text: "Build complete. Please check the build report for any steps that may be required to complete the installation."},
							// button({ text: "Build report", icon: "fa fa-list-ol", onclick: function () { appBuildReport._live(); } }),
							{ $type: "hr" }
						]
					},
					{
						id: "installBuildingFailed",
						style: "display: none;",
						class: "clearfix",
						$components: [
							{
								class: "clearfix",
								$components: [
									{ $type: "p", $text: "Build failed.", class: "pull-left" },
									button( { icon: "fa fa-times", text: "Close", onclick: "modal._kill()", wrapperClass: "pull-right" } ),
								]
							},
							{ $type: "hr" }
						]
					},
					{
						id: "installBuildingLogHidden",
						$components: [
							{
								class: "clearfix",
								$components: [
									button( {
										wrapperClass: "pull-right",
										icon: "fa fa-file-text-o",
										text: "Show log",
										onclick: function () {
											$("#installBuildingLogHidden").hide();
											$("#installBuildingLogShown").slideDown('fast');
										}
									} )
								]
							}
						]
					},
					{
						id: "installBuildingLogShown",
						style: "display: none;",
						$components: [
							{
								class: "clearfix",
								$components: [
									button( {
										wrapperClass: "pull-right",
										icon: "fa fa-file-text-o",
										text: "Hide log",
										onclick: function () {
											$("#installBuildingLogShown").hide();
											$("#installBuildingLogHidden").show();
										}
									} ),
								]
							},
							{
								$type: "pre",
								id: "installBuildingLog",
								$init: function () {
									installBuilding._streamLog();
								},
							}
						]
					},
				]
			}
		});

	},


	_streamLog: function() {

		if ( this._builderLogEventSource ) { this._builderLogEventSource.close() };
		this._builderLogEventSource = new EventSource( serverApiUrl + '/system/builder_log_events' );
		this._builderLogEventSource.onmessage = function(e) {
			response = JSON.parse(e.data);
			if ( response.type == "line" ) {
				var line = response.line;
				this._incrementProgress( line );
				if ( !( line == "." && $("#installBuildingLog").text()[0] == "." ) ) { line = line + "\n" }
				$("#installBuildingLog").prepend( line );
			} else if ( response.type == "eof" ) {
				this._builderLogEventSource.close();
				this._builderLogEventSource = null;
				this._checkBuild();
			};
		}.bind( this );

	},


	_checkBuild: function () {

		apiRequest( {
			action: '/system',
			callbacks: {
				200: function(response) {
					system._refresh(response);
					if ( response.builder.status.is_building ) {
						installBuilding._live();
					} else if ( response.builder.status.did_build_fail ) {
						installBuilding._showFailed();
					} else {
						installBuilding._showComplete();
					};
				}
			}
		} );

	},


	_showComplete: function () {

		$("#installBuildingProgress").hide();
		$("#installBuildingComplete").show();
		installBuilding._loadBuildReport()
	},

	_loadBuildReport: function () {

		apiRequest({
			action: "/apps/" + this._appName + "/build_report",
			callbacks: {
				200: function(response) {
					installBuildingCompleteBuildReport._render( response.build_report );
				}
			}
		});

	},


	_showFailed: function () {

		$("#installBuildingProgress").hide();
		$("#installBuildingFailed").show();

	},

	_incrementProgress: function ( line ) {
		if ( line == "Build Finished" ) {
			installBuildingProgress._setWidth(1);
		} else if ( line == "Waiting for start" ) {
			installBuildingProgress._setWidth(0.95);
		} else if ( line.match(/^Step \d+\/\d+/) ) {
			var step = line.substring(5).split(" : ")[0].split("/");
			installBuildingProgress._setWidth( 0.1 + 0.8 * step[0] / step[1] );
		} else {
			installBuildingProgress._increment();
		};

	}

};
