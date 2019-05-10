cell({

	id: "appOperationsResult",

	_appName: null,
	_operationData: null,
	_responseData: null,

	_live: function ( appName, operationData, responseData ) {
		this._appName = appName;
		this._operationData = operationData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var appName = this._appName;
		var operationData = this._operationData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App operation result",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appDiagnostics._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: operationData.label || operationData.name },
						{ $type: "p", $text: operationData.description },
						appOperationsResult._renderResult( operationData, responseData )
					]
				}
			}
		);

	},

	_renderResult: function ( operationData, responseData ) {
		switch ( operationData.return_type ) {
			case "plain_text":
				return { class: "panel panel-default", $components: [ { class: "panel-body", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) } ] };
				break;
			case "code":
				return { class: "pre", style: "white-space: nowrap; overflow-x: auto;", $components: responseData.split(/\r|\n/).map( function( line ) {
					return { $text: line };
				} ) };
				break;
			case "json":
				return pp( responseData );
				break;
			// case "file":
			// 	return pp( responseData );
			// 	break;
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed operation." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

});
