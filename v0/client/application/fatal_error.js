var $fatalError = {

	$cell: true,
	id: "fatalError",


	_live: function (error) {

		modal._live ( {
			header: icon( { icon: "fa fa-bug", text: "Bug" } ),
			body: {
				$components: [
					{
						$type: "p",
						$text: "Sorry, you have encountered a bug in Engines."
					},
					{
						class: "clearfix",
						$components: [
							button( { onclick: "$('#fatalErrorDetail').toggle();", wrapperClass: "pull-left",
												icon: "fa fa-info", text: "Detail", title: "Error detail" } ),
							button( { onclick: modal._kill, wrapperClass: "pull-right",
												icon: "fa fa-times", text: "No thanks" } ),
							{
								$type: 'form',
								$init: function() {
									$(this).submit(function(e) {
										$.ajax({
						           type: "POST",
						           url: bugReportsUrl,
											 dataType : 'json',
						           data: error,
										   complete: function() {
												 modal._kill();
											 }
						        });
								    e.preventDefault();
									});
								},
								$components: [
									{
										$type: 'button',
										type: 'submit',
										title: 'Send report',
										class: 'btn btn-custom btn-lg pull-right',
										$components: [
											icon( {
												icon: 'fa fa-paper-plane-o',
												text: "Send report"
											} )
										]
									}
								]
							},

												// <%= form_for :bug_report, url: bug_reports_path(), id: 'submit_bug_report_form' do |f| %>
												//     <%= f.hidden_field :data, value: bug_report_data.to_json %>
												//     <div class="clearfix">
												//       <div class="btn-group pull-right">
												//         <% if request.format == 'js' %>
												//           <%= button_tag type: 'button', 'data-dismiss': :modal, class: 'btn btn-warning' do %>
												//             <%= icon_text('fa-times', 'No thanks') %>
												//           <% end %>
												//         <% else %>
												//           <%= link_to icon_text('fa-times', 'No thanks'),:back,
												//             class: "btn btn-warning show_waiting_spinner" %>
												//         <% end %>
												//     		<%= button_tag type: 'submit', id: "submit_bug_report_button", class: "btn btn-primary show_waiting_spinner" do %>
												//     	    <%= icon_text('fa-send', 'Send bug report') %>
												//     	  <% end %>
												//       </div>
												//     </div>

						]
					},
					prettyPrint( {
						id: "fatalErrorDetail",
						style: "display: none;",
						object: error } ),
				]
			}
		} );

	}

};
