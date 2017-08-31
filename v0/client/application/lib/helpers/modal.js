//function modal(obj) { 
//	return {
//		id: obj.id,
//		class: "modal " + obj.class,
//		$components: [
//			{ class: "modal-dialog " + obj.dialogClass,
//				$components: [
//					{ class: "modal-content", 
//						$components: [
//							{ class: "modal-header", 
//								$components: [ 
//									{ $type: "span", 
//										$components: [ obj.header ] }, 
//									{ $type: "span",
//										$html: "<button type=\"button\" class=\"close\" title=\"Close\" data-dismiss=\"modal\"><span>×</span></button>" 
//									} 
//								] 
//							},
//							{ class: "modal-body", $components: [ obj.body ] }						
//						] 
//					}
//				]
//			}
//		],
//		$init: function () {
//			$(this).on('hidden.bs.modal', function() { $$(".modalConsumer")._modalHidden(); });
//			this._show();
//		},
//		_show: function () {
//			$('.modal').modal('hide');
//			$(this).modal('show');
//		},
//		_hide: function () {
//			$(this).modal('hide');
//		}
//	};
//};
