function formSubmit( args={} ) {
	return {
		class: ( args.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "submit",  // args.onclick ? "button" : "submit",
				class: "btn btn-lg btn-custom pull-right disable_button_on_form_submit",
				title: ( args.title || "Submit" ),
				// $components: [
				// 	args.icon == false ? {} : { $type: "i", class: ( args.icon || "fa fa-check" ) },
				// 	args.text == false ? {} : { $type: "span", $text: " " + ( args.text || "OK" ) }
				// ],
				// onclick: function ( e ) {
				// 	var form = $(this).parents("form")[0];
				// 	if ( args.onclick ? args.onclick( e ) : true ) {
				// 	// 	debugger;
				// 		form.reportValidity();
				// 		if ( form.checkValidity() ) {
				// 			this.$components = [
				// 				hourglass(),
				// 				{ $type: "span", $text: " " + ( args.disabledText || args.text || "OK" ) }
				// 			];
				// 			return true;
				// 		} else {
				// 			return false;
				// 		};
				// 	} else {
				// 		return false;
				// 	};
				// }

				$init: function () {
					this._enableButton();
				},

				_disableButton: function () {
					$(this).prop("disabled", "disabled");
					this.$components = [
						hourglass(),
						{ $type: "span", $text: " " + ( args.disabledText || args.text || "OK" ) }
					];
				},

				_enableButton: function () {
					$(this).prop("disabled", "");
					this.$components = [
						args.icon == false ? {} : { $type: "i", class: ( args.icon || "fa fa-check" ) },
						args.text == false ? {} : { $type: "span", $text: " " + ( args.text || "OK" ) }
					];
				},



			}
		]
	}
};
