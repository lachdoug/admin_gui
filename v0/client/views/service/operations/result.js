cell({

	id: "serviceOperationsResult",

	_serviceName: null,
	_operationData: null,
	_responseData: null,

	_live: function ( serviceName, operationData, responseData ) {
		this._serviceName = serviceName;
		this._operationData = operationData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var serviceName = this._serviceName;
		var operationData = this._operationData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service operation result",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceDiagnostics._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: operationData.label || operationData.name },
						{ $type: "p", $text: operationData.description },
						serviceOperationsResult._renderResult( operationData, responseData )
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
