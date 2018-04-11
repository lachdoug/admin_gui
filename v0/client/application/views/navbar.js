var $navbar = {

	$cell: true,
	id: "navbar",
	class: "clearfix",

	_live: function () {
		this.$components = [
			{
				id: 'navbarSystemIp',
				class: "navbar-ip-address",
				style: "font-size: 12px; line-height: 46px; text-align: center; position: absolute; width: 100%; z-index: -1;",
				$text: systemIp,
			},
			{
				class: "navbar-brand pull-left",
				style: "padding: 7px 15px; line-height: 30px;",
				$components: [
					{
						$type: "span",
						style: "margin-top: -3px;",
						$components: [ enginesIconSvg(20) ]
					},
					{
						$type: "span",
						style: "vertical-align: middle;",
						$text: "Engines "
					},
				]
			},
			button({
				onclick: main._signOut,
				wrapperId: "navbarSignOutButton",
				wrapperClass: "pull-right",
				wrapperStyle: "display: none;",
				title: "Sign out",
				icon: "fa fa-sign-out"
			}),
		]
	}
};
