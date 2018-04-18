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
					// TODO: Fix invalid field focus. It would be good to focus on first invalid field, but not working nicely with sigin form because browser inserts password after field gets focus
								// $(this).parents("form").find("input:invalid, select:invalid, textarea:invalid").first().focus();
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
