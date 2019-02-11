var $modal = {

	$cell: true,
	id: "modal",

	$components: [
		{
			id: "modalContent",
			class: "modal",
			tabindex: -1,
		}
	],


	_live: function (obj) {

		$(".modal").attr("class","modal " + ( obj.class || "" ) );
		$(".modal").modal({ keyboard: true, backdrop: 'static'});
		modalContent.$components = [
			{ class: "modal-dialog " + ( obj.dialogClass || "" ),
				$components: [
					{ class: "modal-content",
						$components: [
							{ class: "modal-header",
								$components: [
									{ $type: "span",
										$components: [ ( obj.header || null ) ] },
									button( {
										wrapperClass: "pull-right",
										wrapperStyle: "margin: -13px;",
										icon: "fa fa-times",
										onclick: function() { $('.modal').modal('hide'); },
									} )
								]
							},
							{
								class: "modal-body",
								style: "overflow-x: auto;",
								$components: [ ( obj.body || null ) ]
							}
						]
					}
				]
			}
		];

	},


	_kill: function () {

		$(".modal").modal('hide');

	},


	_clearContents: function () {

		modalContent.$components = [];

	},


	$init: function () {

		$(this).on('hidden.bs.modal', function() {
			this._clearContents();
		} );

		$(this).find('.modal-dialog').scroll( function() {
  		alert("Scrolling");
		} ) ;

	},

};
