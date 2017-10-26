function progressBar(obj) {
	return {

		id: ( obj.id || null ),

		_progress: 0,
		_minorProgress: 0,

		$components: [
			{
				class: "progress",
				$components: [
					{
						role: "progressbar",
						class: "major progress-bar progress-bar-striped active"
					},
					{
						role: "progressbar",
						// style: "background-image: none;",
						class: "minor progress-bar progress-bar-info progress-bar-striped active"
					}
				]
			},
		],

		_showMinorProgress: function () {
			this._minorProgress = this._minorProgress + 5;
			var remaining = 1000 - this._progress;
			if ( this._minorProgress > remaining ) {
				this._minorProgress = 0
			};
		},

		_setWidth: function ( widthRatio ) {

			this._progress = widthRatio * 1000;
			this._minorProgress = 0;

		},


		$update: function () {

			$(this).find(".major.progress-bar").css('width', (this._progress/10).toString() + '%');
			$(this).find(".minor.progress-bar").css('width', (this._minorProgress/10).toString() + '%');

		}

	}
}
