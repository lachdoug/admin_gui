var formFieldSelectMultiple = function( args ) {

	return formFieldWrapper(
		args,
		{
			$components: [
				{
					$type: "select",
					class: args.class + " form-control",
					onchange: function () {
						this.nextSibling._addSelectedItem( {
							value: $(this).val(),
							label: $(this).find(':selected').not("option[value='']").text(),
						} );
					},
					_disableListItem: function( value ) {
						$(this).find("option[value='" + value + "']").prop('disabled', true);
						this._unselect();
					},
					_enableListItem: function( value ) {
						$(this).find("option[value='" + value + "']")[0].removeAttribute('disabled');
						this._unselect();
					},
					_unselect: function () {
						$(this).find("option")[0].removeAttribute('disabled');
						$(this).val(null);
						$(this).find("option").first().prop('disabled', true);
					},
					// Always include blank in select list
					$components: formFieldCollectionSelectOptions( $.extend( {}, args, { collectionIncludeBlank: true, value: '' } ) )
				},
				{
					class: "formFieldSelectMultipleSelectedItems",
					style: "margin-top: 5px;",

					_items: [],
					_itemCount: 0,

					$init: function () {
						items = [];
						var formFieldSelectMultipleSelectedItems = this;
						var preselectedValues = formFieldCollectionMultipleValues( args.value );
						if ( preselectedValues.length ) {
							preselectedValues.map( function( value ) {
								var label = $(formFieldSelectMultipleSelectedItems).prev().find("option[value='" + value + "']").text();
								items.unshift( { value: value, label: label } );
								formFieldSelectMultipleSelectedItems.previousSibling._disableListItem( value );
							} )
						};
						this._items = items;
						this._render();
					},

					_addSelectedItem: function ( item ) {
						this._items.unshift(item);
						this.previousSibling._disableListItem( item.value );
						this._render();
					},

					_removeSelectedItem: function ( item, i ) {
						this._items.splice(i,1);
						this.previousSibling._enableListItem( item.value );
						this._render();
					},

					_render: function () {
						var newItemHasBeenAdded = this._items.length > this._itemCount;
						this._itemCount = this._items.length;
						this.$components = [
							this._itemCount ?
							{
								style: "border: 1px solid #ccc; min-height: 34px; padding: 1px 5px;",
								$components: this._items.map( function(item ,i) {
									return {
										class: "formFieldSelectMultipleSelectedItem",
										style: ( i == 0 && newItemHasBeenAdded ) ? "display: none;" : "",
										$init: function() {
											$(this).fadeIn();
										},
										$components: [
											formFieldInputUnwrapped({
												name: args.name + '[]',
												value: item.value,
												type: 'hidden'
											}),
											{
												class: "clearfix",
												style: "display: block;",
												$components: [
													{
														$text: item.label,
														class: "pull-left",
														style: "padding: 4px 7px;",
													},
													{
														class: "btn btn-custom pull-right",
														style: "padding: 3px 7px;",
														title: "Click to remove",
														$components: [
															icon({icon: "fa fa-times"})
														],
														onclick: function(e) {
															$(e.target).closest(".formFieldSelectMultipleSelectedItem").slideUp(
																'fast', function() {
																	$(e.target).closest(".formFieldSelectMultipleSelectedItems")[0]._removeSelectedItem(item, i);
																}
															);
														}
													}
												],
											}
										]
									}
								} )
							}
							:
							{
								$type: "input",
								class: 'form-control',
								placeholder: "None",
								onfocus: function () {
									$(this).closest(".formFieldSelectMultipleSelectedItems").prev().focus();
								},
								required: args.required,
							}
					 	];
					},
				}
			]
		}

	);
};
