function openUrl(url) {

  if ( url ) {

    var target = window.open(url, url);

    if ( target ) {
      target.focus();
    } else {
      alert('Your browser is blocking popups for this website.');
    };

  } else {

    alert('This link does not have a URL.');
    
  };

};
