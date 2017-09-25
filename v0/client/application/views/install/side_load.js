var $installSideLoad = {

	$cell: true,
	id: "installSideLoad",


	_live: function() {
		modal._live(
			{
				header: icon( { icon: "fa fa-caret-square-o-right", text: "Side load" } ),
				body: {
					$components: [
						form( {
							components: [
								formField( {
									name: "url",
									id: "installSideLoadField_url",
									type: "url",
									label: "Blueprint URL",
									required: true
								} ),
								formCancel ( { onclick: systemControlPanel._live } ),
								formSubmit()
							],
							init: function ( form ) {
								$(form).submit( function( e ) {
									installNewApp._live(
										$("#installSideLoadField_url").val(),
										function() {
											installSideLoad._live();
										}
									);
									e.preventDefault();
								} );
							}
						} ),
					],
				}
			}
		);
	},

};
