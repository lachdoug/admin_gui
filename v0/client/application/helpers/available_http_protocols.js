function availableHttpProtocols( defaultHttpProtocol ) {

  if ( defaultHttpProtocol == "http_only" ) {
    return [ [ "http_only", "HTTP only" ] ];
  } else if ( defaultHttpProtocol == "https_only" ) {
    return [ [ "https_only", "HTTPS only" ] ]
  } else {
    return [
      [ "https_and_http", "HTTPS and HTTP" ],
      [ "http_and_https", "HTTP and HTTPS" ],
      [ "https_only", "HTTPS only" ],
      [ "http_only", "HTTP only" ]
    ]
  };

};
