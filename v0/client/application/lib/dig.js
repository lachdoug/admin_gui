function dig(obj, ...keys) {

  for (const key of keys) {
    if ( obj == null ) {
      return null;
    } else {
      obj = obj[key] || null;
    }
  };

  return obj;
  
};
