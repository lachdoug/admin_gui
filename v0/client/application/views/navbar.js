var $navbar = {

	$cell: true,
	id: "navbar",
	class: "container-fluid clearfix",


	_live: function () {
		this.$components = [
			{
				class: "navbar-brand",
				style: "padding: 7px 15px; line-height: 30px;",
				$components: [
					{
						$type: "span",
						style: "vertical-align: middle;",
						$components: [ enginesIconSvg(30) ]
					},
					{
						$type: "span",
						style: "vertical-align: middle;",
						$text: "Engines "
					},
					// {
					// 	$type: "small",
					// 	style: "vertical-align: middle;",
					// 	$text: systemApiUrl
					// },
				]
			},
			remoteManagement ? button({
				onclick: selectSystem._live,
				title: "Select system",
				icon: "fa fa-caret-right",
				class: "btn btn-sm",
				wrapperStyle: "display: inline;",
				// wrapperClass: "pull-right",
				style: "height: 46px;",
				text: systemApiUrl || 'Select system'
			}) : {
				$type: 'span',
				style: "display: inline; font-size: 12px; line-height: 46px;",
				$text: systemApiUrl
			},
			button({
				onclick: main._signOut,
				wrapperId: "navbarSignOutButton",
				wrapperClass: "pull-right",
				wrapperStyle: "display: none;",
				title: "Sign out",
				icon: "fa fa-sign-out"
			})
		]
	}
};
