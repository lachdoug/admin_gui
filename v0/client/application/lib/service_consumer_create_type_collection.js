function serviceConsumerCreateType( consumableService ) {
// debugger;
  var selectOptions = {	create: "Create new" };
  if ( consumableService.shareable.length > 0 ) {
  	selectOptions.share = "Share existing";
  };
  if ( consumableService.adoptable.length > 0 ) {
  	selectOptions.adopt = "Adopt orphan";
  };
  return selectOptions;

};
