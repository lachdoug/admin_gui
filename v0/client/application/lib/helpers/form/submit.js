var formSubmit = function (obj={}) {
	return {
		class: ( obj.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: obj.onclick ? "button" : "submit",
				class: "btn btn-lg btn-custom pull-right",
				title: ( obj.title || "Submit form" ),
				$components: [
					obj.icon == false ? {} : { $type: "i", class: ( obj.icon || "fa fa-check" ) },
					obj.text == false ? {} : { $type: "span", $text: " " + ( obj.text || "OK" ) }
				],
			 	onclick: function () {
					if ( obj.onclick ) {
						obj.onclick();
					} else {
						if ( $(this).parents("form")[0].checkValidity() ) {
						$(this).parents("form").find("button").prop("disabled", "disabled");
							this.$components = [
								obj.disabledIcon == false ? {} : { $type: "i", class: ( obj.disabledIcon || "fa fa-hourglass-o" ) },
								obj.disabledText == false ? {} : { $type: "span", $text: " " + ( obj.disabledText || obj.text || "OK" ) }
							];
						};
					};
				}
			}
		]
	}
};
