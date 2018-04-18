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
									name: "blueprint_url",
									id: "installSideLoadField_blueprint_url",
									type: "url",
									label: "Blueprint URL",
									required: true
								} ),
								formField( {
									name: "icon_url",
									id: "installSideLoadField_icon_url",
									type: "url",
									label: "Icon URL",
									required: false
								} ),
								formCancel ( { onclick: systemControlPanel._live } ),
								formSubmit()
							],
							init: function ( form ) {
								$(form).submit( function( e ) {
									installNewApp._live(
										{
											blueprint_url: $("#installSideLoadField_blueprint_url").val(),
											icon_url: $("#installSideLoadField_icon_url").val()
										},
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
