var $systemDisconnected = {

	$cell: true,
	id: "systemDisconnected",

  _live: function () {
    this.$components = [
      {
        class: "text-center",
        style: "display: none;",
        $init: function() { $(this).fadeIn(); },
        $components: [
          { $text: "System not connected." },
          button({
            icon: "fa fa-repeat",
            onclick: "location.reload();"
          })
        ]
      }
    ];
  },

  _kill: function () {
    this.$components = [];
  },

};
