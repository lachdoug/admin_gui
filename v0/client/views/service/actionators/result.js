var $serviceActionatorsResult = {

	$cell: true,
	id: "serviceActionatorsResult",

	_serviceName: null,
	_actionatorData: null,
	_responseData: null,

	_live: function ( serviceName, actionatorData, responseData ) {
		this._serviceName = serviceName;
		this._actionatorData = actionatorData;
		this._responseData = responseData;
		this._show();
	},


	_show: function () {

		var serviceName = this._serviceName;
		var actionatorData = this._actionatorData;
		var responseData = this._responseData;

		modal._live (
			{
				dialogClass: "modal-lg",
				header: icon ( {
					icon: "fa fa-crosshairs",
					text: "Service actionators",
				} ),
				body: {
					$components: [

						{
							class: "clearfix",
							$components: [
								button( {
									icon: "fa fa-arrow-up",
									wrapperClass: "pull-right",
									onclick: function () { serviceActionators._live( serviceName ); }
								} ),
								{ $type: "h4", $text: serviceName },
							]
						},
						{ $type: "hr" },
						{ $type: "h4", $text: actionatorData.label || actionatorData.name },
						{ $type: "p", $text: actionatorData.description },
						serviceActionatorsResult._renderResult( actionatorData, responseData )
					]
				}
			}
		);

	},

	_renderResult: function ( actionatorData, responseData ) {
		switch ( actionatorData.return_type ) {
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
			case "file":
				return button({
					onclick: function () { downloadTextAsFile( actionatorData.return_file_name, responseData ) },
					icon: 'fa fa-download',
					text: 'Download'
				});
				break;
			case "none":
				return { class: "panel panel-default", $components: [ { class: "panel-body", $components: [ { $type: "i", $text: "Successfully performed actionator." } ] } ] };
				break;
			default:
				return pp( responseData );
		}
	},

};
