function collapse(args) {
	return {
		class: ( args.wrapperClass || null ),
		style: ( args.wrapperStyle || null ),
		$components: [
      {
        // _in: false,
        $init: function () { this.$update() },
        $update: function () {
          // var collapser = this;
          this.$components = [
            buttonUnwrapped( {
              icon: "fa fa-caret-right",
              text: args.text,
              onclick: function () {
                $(this).next().next().slideDown('fast');
                $(this).next().show();
                $(this).hide();
              }
            } ),
            buttonUnwrapped( {
              icon: "fa fa-caret-down",
              text: args.text,
              style: "display: none;",
              onclick: function () {
                $(this).next().slideUp('fast');
                $(this).prev().show();
                $(this).hide();
              }
            } ),
            {
              class: "panel panel-default",
              style: "display: none;",
              $components: [ {
                class: "panel-body",
                $components: [ args.body ]
              } ],
            },

          ];

        },

      },
		]
	}
};
