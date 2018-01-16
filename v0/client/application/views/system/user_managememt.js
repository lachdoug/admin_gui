// cell({
//
// 	id: "systemUserManagement",
//
// 	_live: function () {
//
// 		modal._live ( {
// 			header: icon( { icon: "fa fa-user-plus", text: "System user management" } ),
// 			body: {
// 				$components: [
// 					{
// 						class: "clearfix",
// 						$components: [
// 							button( {
// 								onclick: systemControlPanel._live,
// 								icon: "fa fa-arrow-up",
// 								wrapperClass: "pull-right"
// 							} ),
// 						]
// 					},
// 					button( {
// 						onclick: systemUsers._live,
// 						icon: "fa fa-user",
// 						text: "Users"
// 					} ),
// 					button( {
// 						onclick: systemUserGroups._live,
// 						icon: "fa fa-users",
// 						text: "User groups"
// 					} ),
// 					button( {
// 						onclick: systemEmailDomains._live,
// 						icon: "fa fa-globe",
// 						text: "Email domains"
// 					} ),
// 					button( {
// 						onclick: systemEmailAddresses._live,
// 						icon: "fa fa-envelope-square",
// 						text: "Email addresses"
// 					} ),
// 					button( {
// 						onclick: systemDistributionLists._live,
// 						icon: "fa fa-share-square-o",
// 						text: "Distribution lists"
// 					} ),
//
// 				]
// 			}
// 		} );
//
// 	},
//
//
// });
