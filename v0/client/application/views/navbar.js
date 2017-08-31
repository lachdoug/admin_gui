var $navbar = {

	$cell: true,
	id: "navbar",
	class: "container-fluid clearfix",

	
	_live: function () {
		this.$components = [
			{ 
				class: "navbar-brand",
				style: "padding: 7px 15px; 13px 15px; line-height: 30px;",
				$components: [ 
					{ 
						$type: "span", 
						style: "vertical-align: middle;", 
						$components: [ enginesIconSvg(30) ]
					}, 
					{ 
						$type: "span", 
						style: "vertical-align: middle; padding-top: 3px;", 
						$text: "Engines"
					} 
				] 
			},
			{
				id: "navbarSignOutButton",
				style: "display: none;",
				$components: [
					button({
						onclick: "main._signOut();",
						wrapperClass: "pull-right",
						title: "Sign out",
						icon: "fa fa-sign-out"
					})
				]
			}
		]
	}
};
