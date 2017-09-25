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
					var form = $(this).parents("form")[0];

					// debugger

					if ( form.checkValidity() ) {
						$(form).find("button").prop("disabled", "disabled");
						this.$components = [
							hourglass(),
							{ $type: "span", $text: " " + ( obj.text || "OK" ) }
						];
					};
					// if ( obj.onclick ) {
					// 	obj.onclick( form );
					// };
				}
			}
		]
	}
};
