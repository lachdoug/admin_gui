var $appActionsResult = {

	$cell: true,
	id: "appActionsResult",

	_appName: null,
	_actionData: null,
	_responseData: null,

	_live: function ( appName, actionData, responseData ) {
		this._appName = appName;
		this._actionData = actionData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var appName = this._appName;
		var actionData = this._actionData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "App actions",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { appActions._live( appName ); }
								} ),
								{ $type: "h4", $text: appName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: actionData.label || actionData.name },
						{ $type: "p", $text: actionData.description },
						appActionsResult._renderResult( actionData, responseData )
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
			// case "file":
			// 	return pp( responseData );
			// 	break;
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed action." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

};
