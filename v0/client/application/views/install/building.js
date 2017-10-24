var $installBuild = {

	$cell: true,
	id: "installBuild",

	_builderLogEventSource: null,
	_appName: null,

	_live: function () {

		this._appName = system._data.builder.current.engine_name;

		modal._live ( {
			dialogClass: "modal-lg",
			header: icon({icon: "fa fa-plus", text: "Building app"}),
			body: {
				$components: [
					{ $type: "h4", $text: installBuild._appName },
					progressBar( { id: "installBuildProgress" } ),
					{
						id: "installBuildComplete",
						style: "display: none;",
						$components: [
							{
								id: "installBuildCompleteBuildReport",
								$components: [
									{ $type: "hr" },
									{ $type: "p", $text: "Build complete. Please review the build report and follow its instructions." },
									button( {
										icon: "fa fa-list-ol",
										text: "Build report",
										onclick: function () { appBuildReport._live( installBuild._appName ); },
									} ),
									// icon ( { icon: "fa fa-spinner fa-spin", text: "Loading build report" } )
								],
								// _render: function (report) {
								// 	this.$components = [
								// 	];
								// }
							},
							// { $type: "p", $text: "Build complete. Please check the build report for any steps that may be required to complete the installation."},
							// button({ text: "Build report", icon: "fa fa-list-ol", onclick: function () { appBuildReport._live(); } }),
							{ $type: "hr" }
						]
					},
					{
						id: "installBuildFailed",
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
						id: "installBuildLogHidden",
						$components: [
							{
								class: "clearfix",
								$components: [
									button( {
										wrapperClass: "pull-right",
										icon: "fa fa-file-text-o",
										text: "Show log",
										onclick: function () {
											$("#installBuildLogHidden").hide();
											$("#installBuildLogShown").slideDown('fast');
										}
									} )
								]
							}
						]
					},
					{
						id: "installBuildLogShown",
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
											$("#installBuildLogShown").hide();
											$("#installBuildLogHidden").show();
										}
									} ),
								]
							},
							{
								$type: "pre",
								id: "installBuildLog",
								$init: function () {
									installBuild._streamLog();
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
		this._builderLogEventSource = new EventSource( '/system/builder_log_events' );
		this._builderLogEventSource.onmessage = function(e) {
			response = JSON.parse(e.data);
			if ( response.type == "line" ) {
				var line = response.line;
				this._incrementProgress( line );
				if ( !( line == "." && $("#installBuildLog").text()[0] == "." ) ) { line = line + "\n" }
				$("#installBuildLog").prepend( line );
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
						installBuild._live();
					} else if ( response.builder.status.did_build_fail ) {
						installBuild._showFailed();
					} else {
						installBuild._showComplete();
					};
				}
			}
		} );

	},


	_showComplete: function () {

		$("#installBuildProgress").hide();
		$("#installBuildComplete").show();
		// installBuild._loadBuildReport();
	},

	// _loadBuildReport: function () {
	//
	// 	apiRequest({
	// 		action: "/apps/" + this._appName + "/build_report",
	// 		callbacks: {
	// 			200: function(response) {
	// 				installBuildCompleteBuildReport._render( response.build_report );
	// 			}
	// 		}
	// 	});
	//
	// },


	_showFailed: function () {

		$("#installBuildProgress").hide();
		$("#installBuildFailed").show();

	},

	_incrementProgress: function ( line ) {
		if ( line == "Build Finished" ) {
			installBuildProgress._setWidth(1);
		} else if ( line == "Waiting for start" ) {
			installBuildProgress._setWidth(0.95);
		} else if ( line.match(/^Step \d+\/\d+/) ) {
			var step = line.substring(5).split(" : ")[0].split("/");
			installBuildProgress._setWidth( 0.1 + 0.8 * step[0] / step[1] );
		} else {
			installBuildProgress._showMinorProgress();
		};

	}

};
