var $selectSystem = {

	$cell: true,
	id: "selectSystem",


  _live: function () {
    modal._live ( {
      header: icon( { icon: "fa fa-caret-right", text: "Select system" } ),
      body: {
        $components: [ selectSystem._form() ]
      }
    } );
  },


  _form: function () {
		return form( {
			components: [
				formField( { name: "data[system_api_url]", value: systemApiUrl, label: 'System API URL', type: 'url', required: true } ),
				formCancel(),
				formSubmit()
			],
			action: "/client/select_system",
      method: "PUT",
			callbacks: {
				200: function ( response ) {
          
          location.reload();
          //
          // systemApiUrl = response.system_api_url;
					// modal.kill();
					// system._live();
				}
			}
		} )
  },

};
