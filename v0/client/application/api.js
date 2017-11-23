var api = {

	$cell: true,
	id: "api",


	_bindForm: function( form ) {
		$(form).submit(function( e ) {

			var data = new FormData($(this)[0]);
			var method = ( form.method || "POST" );

			var formButons = $(form).find("button.disable_button_on_form_submit");

			formButons.each(
				function( index ) {
					// debugger;
					formButons[index]._disableButton();
				}
			);

			$.ajax({
				url: form.action,
				method: method,
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				complete: ( response ) => {
					formButons.each(
						function( index ) {
							formButons[index]._enableButton();
						}
					);
					api._handleResponse( response , { action: form.action, data: data, callbacks: form._callbacks } );
				}
			});

			e.preventDefault();
			return false;

		} );

	},


	_request: function( args ) {
		$.ajax( {
			url: args.action,
			method: ( args.method || "GET" ),
			data: args.data || null,
			complete: function( response ) {
				api._handleResponse( response, args )
			}
		} );
	},


	_handleResponse: function( response, args ) {
//				alert("api call: " + args.action + " complete");
		$("#pageLoadingSpinner").fadeOut();

		responseContentType = response.getResponseHeader("Content-Type")

		if ( response.status == 0 ) {
			api._handleNoResponse( response, args );
		} else if ( responseContentType == "application/json" ) {
			api._handleJsonResponse(response, args);
		} else if ( responseContentType == "application/octet-stream" ) {
			api._handleStreamResponse(response, args);
		} else if ( responseContentType == "text/html;charset=utf-8" ) {
			api._handleHtmlResponse(response, args);
		} else {

			var backtrace = ( new Error() ).stack.split("\n");
			var message = response.responseText;
			fatalError._live( {
				message: message,
				detail: {
					source: "Admin GUI ApiV0 v0.5",
					type: "Client" + response.status,
					text: response.statusText,
					args: args,
					backtrace: backtrace[0] }
			} );
		};
	},

	_handleNoResponse: function ( response, args ) {
		var callbacks = args.callbacks || {};
		var callback = callbacks[response.status];
		if ( ( typeof(callback) === "undefined" ) ) {
			this._defaultNoResponseHandler(response, args);
		} else {
			callback();
		};
	},

	_defaultNoResponseHandler: function ( response, args ) {
		main._renderUnavailableSystem();
	},

	_handleHtmlResponse: function( response, args ) {
		document.open('text/html');
		document.write(response.responseText);
		document.close();
		window.history.pushState( {"html":response.responseText},"", args.action );
	},


	_handleStreamResponse: function( response ) {
		var regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		var match = regex.exec( response.getResponseHeader("Content-Disposition") );
		var fileName = match[1].replace(/^"(.*)"$/, '$1') || "engines_file.txt";
		download(new Blob([response.responseText]), fileName, "text/plain");
	},

	_handleJsonResponse: function( response, args ) {

		var callbacks = args.callbacks || {};

		var callback = callbacks[response.status];
		if ( ( typeof(callback) === "undefined" ) ) {
			this._defaultJsonResponseHandler(response, args);
		} else {
			callback( JSON.parse(response.responseText) );
		};

	},


	_defaultJsonResponseHandler: function( response, args ) {
		switch (response.status)	{
			case 200:
				alert('OK.\n\n' +
							JSON.stringify(JSON.parse(response.responseText), null, 2));
				break;
// 			case 400:

// //				alert("Client error.\n\n" + JSON.parse(response.responseText).error.message );
// 				break;
			case 401:
			 	alert("Authentication error.\n\n" + JSON.parse(response.responseText).error.message );
				main._renderSignedOut();
				break;
			case 405:
				alert( JSON.parse(response.responseText).error.message );
				break;
			case 500:
				fatalError._live( JSON.parse(response.responseText).error );
				break;
			case 503:
				main._renderUnavailableSystem( { message: JSON.parse(response.responseText).error.message } );
				break;
			default:
				var backtrace = ( new Error() ).stack.split("\n");

				var message = response.status ? JSON.parse(response.responseText).error.message : "No response.";
				fatalError._live( {
					message: message,
					detail: {
						source: "Admin GUI ApiV0 v0.5",
						type: "Client" + response.status,
						text: response.statusText,
						args: args,
						backtrace: backtrace[0] }
				} );
		};

	}

};
