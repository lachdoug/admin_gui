var $serviceActionsResult = {

	$cell: true,
	id: "serviceActionsResult",

	_serviceName: null,
	_actionData: null,
	_responseData: null,

	_live: function ( serviceName, actionData, responseData ) {
		this._serviceName = serviceName;
		this._actionData = actionData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var serviceName = this._serviceName;
		var actionData = this._actionData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service actions",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceActions._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: actionData.label || actionData.name },
						{ $type: "p", $text: actionData.description },
						serviceActionsResult._renderResult( actionData, responseData )
					]
				}
			}
		);

	},

	_renderResult: function ( actionData, responseData ) {
		switch ( actionData.return_type ) {
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
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed action." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

};
