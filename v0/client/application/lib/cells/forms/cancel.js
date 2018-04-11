var formCancel = function (obj={}) {
	return {
		class: ( obj.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "button",
				class: "btn btn-lg btn-custom pull-left disable_button_on_form_submit",
				id: "form_cancel_button",
				title: ( obj.title || "Cancel" ),
			 	onclick: ( obj.onclick || modal._kill ),

				$init: function () {
					this._enableButton();
				},

				_disableButton: function () {
					$(this).prop("disabled", "disabled");
				},

				_enableButton: function () {
					$(this).prop("disabled", "");
					this.$components = [
						obj.icon == false ? {} : { $type: "i", class: ( obj.icon || "fa fa-times" ) },
						obj.text == false ? {} : { $type: "span", $text: " " + ( obj.text || "Cancel" ) }
					];
				},

			}
		]
	}
};
