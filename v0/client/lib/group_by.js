function groupArrayBy( ary, key ) {

  result = {};

  ary.map( function ( item ) {
    var group = result[item[key]] || [];
    group.push( item );
    result[item[key]] = group;
  } );

  return result;
  
};
