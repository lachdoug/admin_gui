function formSubmit( args={} ) {
	return {
		class: ( args.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "submit",
				class: "btn btn-lg btn-custom pull-right disable_button_on_form_submit",
				title: ( args.title || "Submit" ),

				$init: function () {
					this._enableButton();
					args.init && args.init(this);
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
