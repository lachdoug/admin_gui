var formCancel = function (obj={}) {
	return {
		class: ( obj.wrapperClass || null ),
		$components: [
			{ $type: "button",
				type: "button",
				class: "btn btn-lg btn-custom pull-left",
				title: ( obj.title || "Cancel" ),
				$components: [
					obj.icon == false ? {} : { $type: "i", class: ( obj.icon || "fa fa-times" ) },
					obj.text == false ? {} : { $type: "span", $text: " " + ( obj.text || "Cancel" ) }
				],
			 	onclick: ( obj.onclick || "$('.modal').modal('hide');" )
			}
		]
	}
};
