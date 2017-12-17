// cell({
//
//   id: "systemAppTitle",
//
//
//   _polling: function () {
//     clearTimeout( systemMemory._pollContainerMemoryTimeout );
//     if (showContainerMemoryUsage) {
//       apiRequest({
//         action: '/system/statistics/container_memory',
//         callbacks: {
//           200: function(response) {
//             if (showContainerMemoryUsage) {
//               systemMemory._handler(response);
//               systemMemory._pollContainerMemoryTimeout = setTimeout( function() {
//                 systemMemory._polling();
//               }, 7000)
//             };
//           },
//         }
//       });
//     };
//   },
//
//
//   _handler: function( data ) {
//     systemApps._refreshMemory(data.containers.applications);
//   },
//
// });
