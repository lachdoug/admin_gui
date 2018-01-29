function hourglass( args ) {
  return {
    $type: "i",
    class: "fa fa-hourglass-o",
    $init: function() {
      this._animate();
    },
    _animate: function() {
      setTimeout( function() {
        if ( $(this).hasClass("fa-hourglass-o") ) {
          $(this).removeClass("fa-hourglass-o");
          $(this).addClass("fa-hourglass-start");
        } else	if ( $(this).hasClass("fa-hourglass-start") ) {
          $(this).removeClass("fa-hourglass-start");
          $(this).addClass("fa-hourglass-half");
        } else	if ( $(this).hasClass("fa-hourglass-half") ) {
          $(this).removeClass("fa-hourglass-half");
          $(this).addClass("fa-hourglass-end");
        } else	if ( $(this).hasClass("fa-hourglass-end") ) {
          $(this).removeClass("fa-hourglass-end");
          $(this).addClass("fa-hourglass-o");
        };
        this._animate();
      }.bind(this), 1000)
    },
  };
};
