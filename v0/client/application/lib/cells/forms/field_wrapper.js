function formFieldWrapper( args, input) {

	return {
		class: "form-group " + ( args.wrapperClass || "" ),
	  title: ( args.title || args.label || args.name || null ),
		style: ( ( args.dependOn || {} ).input ? "display: none;" : "" ) + ( args.wrapperStyle || "" ),
		$components: [
			args.label == false ? {} : {
				$type: "label",
				$text: ( args.label || args.name || null ),
				for: ( args.id || null )
			},
			{ $text: ( args.comment == false ) ? null : ( args.comment || null ) },
			input,
			{ $type: "small", $text: ( args.hint == false ) ? null : ( args.hint || null ) },
		],
		_dependOn: ( args.dependOn || {} ),
		"data-behavior": ( ( args.dependOn || {} ).input ? "dependent" : "" ),
		$init: function () {
			this._doDependOn();
		},
		onchange: function () {
			this._callDependOn();
		},
		_callDependOn: function () {
			$('[data-behavior~=dependent]').each(
				function( i, dependentField ) {
					dependentField._doDependOn();
				}
			);
		},
		_doDependOn: function () {

			if ( this._dependOn.input ) {
				if (
					(
						this._dependOn.value &&
						( new RegExp( this._dependOn.value ) ).test(
							$( "#" + this._dependOn.input).val()
						)
					) ||
					(
						this._dependOn.property &&
						$( "#" + this._dependOn.input).is(
							":" + this._dependOn.property
						)
					)
				) {
					$(this).show();
					$(this).find("input, select").removeAttr('disabled');
				} else {
					$(this).hide();
					$(this).find("input, select").attr('disabled','disabled');;
				};
			};
		}
	}
};
