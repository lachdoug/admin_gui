function authCheck () {
  return apiRequest({
    action: 'system',
    callbacks: {
      200: function () {
        // do nothing
      },
    },
  });
};
