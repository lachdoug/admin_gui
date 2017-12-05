var formFieldCollectionMultipleValues = function( value_string_or_array ) {
  if ( $.isArray( value_string_or_array ) ) {
    return value_string_or_array
  } else {
    if (  value_string_or_array == null ||
          value_string_or_array == '' ) {
      return [];
    } else {
      return value_string_or_array.replace(/\,\s*/g, ',').split(',')
    };
  }
};
