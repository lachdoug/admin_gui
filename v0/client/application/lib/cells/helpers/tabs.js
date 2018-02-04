function tabs ( args ) {
	return {
		$components: [
			{
				$type: "ul",
				class: "nav nav-tabs",
				style: "margin-bottom: 5px;",
				$components: args.items.map( function (item, i) {
					return {
						$type: "li",
						class: i == 0 ? "active" : "",
						$components: [
							{
								$type: "a",
								$text: item.label,
								onclick: function () {
									$(this).parent().parent().children().removeClass('active');
									$(this).parent().addClass('active');
									$(this).parent().parent().next().children().removeClass('active');
									$(this).parent().parent().next().children().eq(i).addClass('active');
								}
							}
						]

					};
				} )
			},
			{
				class: "tab-content",
				$components: args.items.map( function (item, i) {
					return {
						class: "tab-pane" + ( i == 0 ? " active" : "" ),
						$components: [ item.body ]
					};
				} )
			},
		]
	}
};


//<div>
//
//  <!-- Nav tabs -->
//  <ul class="nav nav-tabs" role="tablist">
//    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>
//    <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Profile</a></li>
//    <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Messages</a></li>
//    <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a></li>
//  </ul>
//
//  <!-- Tab panes -->
//  <div class="tab-content">
//    <div role="tabpanel" class="tab-pane active" id="home">...</div>
//    <div role="tabpanel" class="tab-pane" id="profile">...</div>
//    <div role="tabpanel" class="tab-pane" id="messages">...</div>
//    <div role="tabpanel" class="tab-pane" id="settings">...</div>
//  </div>
//
//</div>
