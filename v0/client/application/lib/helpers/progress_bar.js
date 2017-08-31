function progressBar(obj) {
	return {

		id: ( obj.id || null ),
		class: "progress",
		
		_progress: 0,
		
		$components: [
			{
				class: "progress-bar progress-bar-striped active",
//				style: "width: 45%"
			}
		],

		
		_increment: function () {
			
			if ( this._progress < 990 ) { this._progress = this._progress + 1 };
			
		},
		
		
		_setWidth: function ( widthRatio ) {
			
			this._progress = widthRatio * 1000;
			
		},
		
		
		$update: function () {
			
			
			$(this).find(".progress-bar").css('width', (this._progress/10).toString() + '%')
			
		}
		
	}
}
